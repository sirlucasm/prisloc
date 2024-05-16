import { ModelTypes } from '../types/Schema'

export const extractModelTypesTypeof = (modelType: ModelTypes) => {
  const extractor = {
    String: '',
    Int: 0,
    Boolean: true,
    DateTime: new Date(),
    Object: {},
  }
  if (modelType === 'DateTime') {
    return 'Date'
  }
  return typeof extractor[modelType]
}
