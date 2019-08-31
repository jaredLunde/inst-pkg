import walkSync from 'klaw-sync'

export default function walk(path, {nodir, ignore}) {
  return walkSync(path, {nodir}).filter(o => !ignore || !ignore(o.path))
}
