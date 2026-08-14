export function contractFilePath(clientId: string, contractId: string) {
  return `/api/clients/${clientId}/contracts/${contractId}/file`;
}
