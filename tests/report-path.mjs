import {mkdirSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {dirname,resolve} from 'node:path'
/** Report file under DSH_LONG_TASK_REPORT_DIR, else the workspace skill-checks directory. */
export function reportPath(name){
  const file=resolve(process.env.DSH_LONG_TASK_REPORT_DIR??resolve(tmpdir(),'long-task-reports'),name)
  mkdirSync(dirname(file),{recursive:true})
  return file
}
