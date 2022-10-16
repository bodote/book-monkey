interface NOTIFIC {
  kind: string;
  value: string;
  error: any;
}
export interface FRAME {
  frame: number;
  notification: NOTIFIC;
}
export function logFrames(label: string, frames: FRAME[]) {
  console.log(label + ':');
  frames.forEach((frame: FRAME) => {
    console.log(
      'Frame:',
      frame.frame,
      'Kind',
      frame.notification.kind,
      'Value:',
      frame.notification.value,
      frame.notification.error ? 'Error:' + frame.notification.error : ''
    );
  });
  console.log('----------');
}
