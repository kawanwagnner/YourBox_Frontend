// helpers de file (ext, icon)
export function getFileExtension(filename: string) {
  return filename.split('.').pop();
}

export function getFileIcon(ext: string) {
  switch (ext) {
    case 'pdf': return '📄';
    case 'jpg':
    case 'png': return '🖼️';
    default: return '📁';
  }
}
