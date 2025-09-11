import {
  filenameParse,
  type ParsedFilename,
  type ParsedMovie,
  type ParsedShow,
} from '@ctrl/video-filename-parser';
import type { SourceFile } from '../../prisma/generated/prisma';
import { getRelativePath } from '../util/file';

export type { ParsedFilename, ParsedShow, ParsedMovie };

export const getMetadataForSourceFile = (sourceFile: SourceFile) =>
  filenameParse(getRelativePath(sourceFile).replaceAll('/', ' '));

export const isTv = (metadata: ParsedFilename): metadata is ParsedShow =>
  'isTv' in metadata && metadata.isTv;
