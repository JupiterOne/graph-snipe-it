import {
  SetupRecordingInput,
  mutations,
  setupRecording,
} from '@jupiterone/integration-sdk-testing';

export function setupSnipeItRecording(input: SetupRecordingInput) {
  return setupRecording({
    ...input,
    mutateEntry: (entry) => {
      mutations.unzipGzippedRecordingEntry(entry);
      redact(entry);
    },
  });
}

function redact(entry): void {
  // There is not anything to redact yet, but if something need to be redacted
  // it can be done here
  return;
}
