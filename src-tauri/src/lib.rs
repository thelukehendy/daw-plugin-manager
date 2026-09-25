//! Host commands for the web view. The scanner, matcher and catalog logic run in the
//! web view (shared TypeScript); this side only reads the file system, keeps the app's
//! own files, and talks to the OS. Nothing here writes outside the app data folder.

use serde::Serialize;
use std::fs;
use std::path::{Component, Path, PathBuf};
use std::time::UNIX_EPOCH;
use tauri::{AppHandle, Manager};
use tauri_plugin_dialog::DialogExt;

#[derive(Serialize)]
struct DirEntry {
    name: String,
    #[serde(rename = "isDir")]
    is_dir: bool,
    #[serde(rename = "mtimeMs")]
    mtime_ms: Option<f64>,
}

#[derive(Serialize)]
struct SystemInfo {
    os: &'static str,
    arch: &'static str,
    #[serde(rename = "homeDir")]
    home_dir: String,
    #[serde(rename = "userDataDir")]
    user_data_dir: String,
    #[serde(rename = "osVersion")]
    os_version: Option<String>,
    env: std::collections::HashMap<String, String>,
    /// Debug builds only: scan at startup and write a parity snapshot (DPM_PARITY_DUMP=1).
    #[serde(rename = "parityDump")]
    parity_dump: bool,
}

/// Entries of a directory; None when it doesn't exist or can't be read.
#[tauri::command]
fn read_dir(path: String) -> Option<Vec<DirEntry>> {
    let entries = fs::read_dir(&path).ok()?;
    let mut out = Vec::new();
    for entry in entries.flatten() {
        let name = entry.file_name().to_string_lossy().into_owned();
        // Follow symlinks, like Node's stat().
        let Ok(meta) = fs::metadata(entry.path()) else { continue };
        let mtime_ms = meta
            .modified()
            .ok()
            .and_then(|t| t.duration_since(UNIX_EPOCH).ok())
            .map(|d| d.as_secs_f64() * 1000.0);
        out.push(DirEntry { name, is_dir: meta.is_dir(), mtime_ms });
    }
    Some(out)
}

fn plist_to_json(value: plist::Value) -> serde_json::Value {
    use serde_json::Value as J;
    match value {
        plist::Value::Array(items) => J::Array(items.into_iter().map(plist_to_json).collect()),
        plist::Value::Dictionary(dict) => {
            J::Object(dict.into_iter().map(|(k, v)| (k, plist_to_json(v))).collect())
        }
        plist::Value::Boolean(b) => J::Bool(b),
        plist::Value::Integer(i) => i
            .as_signed()
            .map(|n| J::from(n))
            .or_else(|| i.as_unsigned().map(J::from))
            .unwrap_or(J::Null),
        plist::Value::Real(f) => serde_json::Number::from_f64(f).map(J::Number).unwrap_or(J::Null),
        plist::Value::String(s) => J::String(s),
        plist::Value::Date(d) => J::String(d.to_xml_format()),
        plist::Value::Uid(u) => J::from(u.get()),
        // Binary blobs are never needed by the scanner.
        _ => J::Null,
    }
}

/// Parse XML or binary plists; null for files that are missing or unreadable.
#[tauri::command]
fn read_plists(paths: Vec<String>) -> Vec<Option<serde_json::Value>> {
    paths
        .iter()
        .map(|p| plist::Value::from_file(p).ok().map(plist_to_json))
        .collect()
}

#[tauri::command]
fn read_text(path: String) -> Option<String> {
    fs::read_to_string(path).ok()
}

#[tauri::command]
fn path_exists(path: String) -> bool {
    Path::new(&path).exists()
}

fn app_data_dir(app: &AppHandle) -> Result<PathBuf, String> {
    app.path().app_data_dir().map_err(|e| e.to_string())
}

/// Resolve a path inside the app data folder, refusing anything that could escape it.
fn app_file_path(app: &AppHandle, relative: &str) -> Result<PathBuf, String> {
    let rel = Path::new(relative);
    if rel.is_absolute() || rel.components().any(|c| !matches!(c, Component::Normal(_))) {
        return Err("path must stay inside the app data folder".into());
    }
    Ok(app_data_dir(app)?.join(rel))
}

/// Temp file + rename so a crash never leaves a half-written file.
#[tauri::command]
fn write_app_file(app: AppHandle, relative_path: String, contents: String) -> Result<(), String> {
    let target = app_file_path(&app, &relative_path)?;
    if let Some(parent) = target.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }
    let tmp = target.with_extension("tmp");
    fs::write(&tmp, contents).map_err(|e| e.to_string())?;
    fs::rename(&tmp, &target).map_err(|e| e.to_string())
}

#[tauri::command]
fn bundled_catalog_text(app: AppHandle) -> Option<String> {
    let path = app.path().resource_dir().ok()?.join("catalog").join("catalog.json");
    fs::read_to_string(path).ok()
}

fn os_version() -> Option<String> {
    #[cfg(target_os = "macos")]
    {
        let out = std::process::Command::new("sw_vers").arg("-productVersion").output().ok()?;
        let v = String::from_utf8_lossy(&out.stdout).trim().to_string();
        if !v.is_empty() {
            return Some(v);
        }
    }
    None
}

#[tauri::command]
fn system_info(app: AppHandle) -> Result<SystemInfo, String> {
    let home = app.path().home_dir().map_err(|e| e.to_string())?;
    let env = [
        "ProgramFiles",
        "ProgramFiles(x86)",
        "LOCALAPPDATA",
        "APPDATA",
        "COMMONPROGRAMFILES",
        "COMMONPROGRAMFILES(x86)",
    ]
    .iter()
    .filter_map(|k| std::env::var(k).ok().map(|v| (k.to_string(), v)))
    .collect();
    Ok(SystemInfo {
        os: match std::env::consts::OS {
            "macos" => "darwin",
            "windows" => "win32",
            _ => "linux",
        },
        arch: match std::env::consts::ARCH {
            "aarch64" => "arm64",
            "x86_64" => "x64",
            other => other,
        },
        home_dir: home.to_string_lossy().into_owned(),
        user_data_dir: app_data_dir(&app)?.to_string_lossy().into_owned(),
        os_version: os_version(),
        env,
        parity_dump: cfg!(debug_assertions) && std::env::var("DPM_PARITY_DUMP").is_ok_and(|v| v == "1"),
    })
}

/// Only http(s) links leave the app; everything else is refused.
#[tauri::command]
fn open_url(app: AppHandle, url: String) -> Result<(), String> {
    if !(url.starts_with("https://") || url.starts_with("http://")) {
        return Err("Only http(s) URLs are allowed".into());
    }
    use tauri_plugin_opener::OpenerExt;
    app.opener().open_url(url, None::<&str>).map_err(|e| e.to_string())
}

/// Ask where to save, then write. Returns false when the user cancels.
#[tauri::command]
async fn save_text_file(app: AppHandle, default_name: String, contents: String) -> Result<bool, String> {
    let Some(path) = app
        .dialog()
        .file()
        .set_file_name(&default_name)
        .add_filter("JSON", &["json"])
        .blocking_save_file()
    else {
        return Ok(false);
    };
    let path = path.into_path().map_err(|e| e.to_string())?;
    fs::write(path, contents).map_err(|e| e.to_string())?;
    Ok(true)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            read_dir,
            read_plists,
            read_text,
            path_exists,
            write_app_file,
            bundled_catalog_text,
            system_info,
            open_url,
            save_text_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running DAW Plugin Manager");
}
