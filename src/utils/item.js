// synchronous functions to manage items from redux

import {
  DEFAULT_IMAGE_SRC,
  ITEM_TYPES,
  UUID_LENGTH,
} from '../config/constants';
import { getEmbeddedLinkExtra } from './itemExtra';

export const transformIdForPath = (id) => id.replaceAll('-', '_');

export const getParentsIdsFromPath = (path) =>
  path.replaceAll('_', '-').split('.');

export const getItemById = (items, id) =>
  items.find(({ id: thisId }) => id === thisId);

export const getItemsById = (items, ids) =>
  items.filter(({ id: thisId }) => ids.includes(thisId));

export const getDirectParentId = (path) => {
  const ids = getParentsIdsFromPath(path);
  const parentIdx = ids.length - 2;
  if (parentIdx < 0) {
    return null;
  }
  return ids[parentIdx];
};

export const isChild = (id) => {
  const reg = new RegExp(`${transformIdForPath(id)}(?=\\.[^\\.]*$)`);
  return ({ path }) => path.match(reg);
};

export const getChildren = (items, id) => items.filter(isChild(id));

export const isRootItem = ({ path }) => path.length === UUID_LENGTH;

export const areItemsEqual = (i1, i2) => {
  if (!i1 && !i2) return true;

  if (!i1 || !i2) return false;

  return i1.updatedAt === i2.updatedAt;
};

export const isUrlValid = (str) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)+' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return str && pattern.test(str);
};

export const isItemValid = ({ name, type, extra }) => {
  const shouldHaveName = Boolean(name);
  const { url } = getEmbeddedLinkExtra(extra) || {};

  // item should have a type
  let hasValidTypeProperties = Object.values(ITEM_TYPES).includes(type);
  if (type === ITEM_TYPES.LINK) {
    hasValidTypeProperties = isUrlValid(url);
  }

  return shouldHaveName && hasValidTypeProperties;
};

export const getItemImage = ({ extra }) =>
  extra?.image ||
  getEmbeddedLinkExtra(extra)?.thumbnails?.[0] ||
  DEFAULT_IMAGE_SRC;
