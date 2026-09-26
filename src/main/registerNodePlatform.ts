/** Side-effect import for CLI scripts and tests: use the Node platform. */
import { setPlatform } from './platform'
import { createNodePlatform } from './nodePlatform'

setPlatform(createNodePlatform({ userDataDir: process.env.DPM_USER_DATA_DIR || undefined }))
