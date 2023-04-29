import { BehaviorSubject } from "rxjs";
import { forEach } from "lodash";

import * as collision from "./collision";

export * from "./collision";
export * from "./compact";

const randPos = () => Math.floor(Math.random() * 8);
const subject = new BehaviorSubject([randPos(), randPos()]);

export const EmitSource = () => {
  return subject;
};

export const moveKnight = (toX, toY) => {
  subject.next([toX, toY]);
};

export const canMoveKnight = (toX, toY) => {
  const [x, y] = subject.getValue();
  const dx = toX - x;
  const dy = toY - y;

  return (
    (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
    (Math.abs(dx) === 1 && Math.abs(dy) === 2)
  );
};

export const ItemTypes = {
  KNIGHT: "knight",
  FIELD: "field"
};

/**
 * Set card attribute values ​​in groups
 * @param {Array} groups
 * @param {String} property
 * @param {*} value
 */
export const setPropertyValueForCards = (groups, property, value) => {
  forEach(groups, (g, index) => {
    forEach(g.cards, a => {
      a[property] = value;
    });
  });
};

/**
 * Known number of placed grids, Calculate how big each cell of the container is
 * @param {Number} containerWidth
 * @param {Number} col
 * @param {Number} containerPadding
 * @param {Number} margin
 * @returns {Number} Cell size
 */
export const calColWidth = (containerWidth, col, containerPadding, margin) => {
  if (margin) {
    return (
      (containerWidth - containerPadding[0] * 2 - margin[0] * (col + 1)) / col
    );
  }
  return (containerWidth - containerPadding[0] * 2 - 0 * (col + 1)) / col;
};

/**
 * Know the size of the grid, calculate the number of grids placed in a row of the container
 * @param {Number} defaultCalWidth
 * @param {Number} containerWidth
 * @param {Number} containerPadding
 * @param {Number} margin
 * @returns {Number} Number of cells per row
 */
export const calColCount = (
  defaultCalWidth,
  containerWidth,
  containerPadding,
  margin
) => {
  if (margin) {
    return Math.floor(
      (containerWidth - containerPadding[0] * 2 - margin[0]) /
        (defaultCalWidth + margin[0])
    );
  }
};

/**
 * Get the Y coordinate of the bottom cell in the current layout
 * @param {Array} layout
 * @returns {Number} Bottom cell Y coordinate
 */
export const layoutBottom = layout => {
  let max = 0,
    bottomY;
  for (let i = 0, len = layout.length; i < len; i++) {
    bottomY = layout[i].gridy + layout[i].height;
    if (bottomY > max) max = bottomY;
  }
  return max;
};

/**
 * Calculate horizontal length
 * @param {Array} layout
 * @returns {Number} The maximum length
 */
export const layoutHorizontalRowLength = layout => {
  let max = 0,
    rowX;
  for (let i = 0, len = layout.length; i < len; i++) {
    rowX = layout[i].gridx + layout[i].width;
    if (rowX > max) max = rowX;
  }
  return max;
};
/**
 * Calculate the maximum height of the card container
 * @param {Array} cards
 * @param {Number} rowHeight
 * @param {Number} margin
 * @returns {Number} Container height
 */
export const getContainerMaxHeight = (cards, rowHeight, margin) => {
  const resultRow = layoutBottom(cards);
  return resultRow * rowHeight + (resultRow - 1) * margin[1] + 2 * margin[1];
};

/**
 * Give a grid position, calculate the specific position of the element in the container, the unit is px
 * @param {Number} gridx
 * @param {Number} gridy
 * @param {Number} margin
 * @param {Number} rowHeight
 * @param {Number} calWidth
 * @returns {Object} An object containing x, y coordinates
 */
export const calGridItemPosition = (
  gridx,
  gridy,
  margin,
  rowHeight,
  calWidth
) => {
  const x = Math.round(gridx * calWidth + margin[0] * (gridx + 1));
  const y = Math.round(gridy * rowHeight + margin[1] * (gridy + 1));
  return {
    x: x,
    y: y
  };
};
/**
 * Prevent elements from overflowing the container
 * @param {Int} gridX
 * @param {Int} gridY
 * @param {Int} col
 * @param {Int} w Card width
 * @returns {Object} gridX, gridY cell coordinate object
 */
export const checkInContainer = (gridX, gridY, col, w) => {
  if (gridX + w > col - 1) gridX = col - w; //Right border
  if (gridX < 0) gridX = 0; //Left border
  if (gridY < 0) gridY = 0; //Upper border
  return { gridX, gridY };
};
/**
 * Calculate the coordinates of the cell where the x and y pixel values ​​are located
 * @param {Number} x
 * @param {Number} y
 * @param {Number} cardWidth
 * @param {Number} margin
 * @param {Number} containerWidth
 * @param {Number} col
 * @param {Number} rowHeight
 * @returns {Object} An object containing the cell coordinates of gridx and gridy
 */
export const calGridXY = (
  x,
  y,
  cardWidth,
  margin,
  containerWidth,
  col,
  rowHeight
) => {
  //When coordinates are converted into a grid, round down, no need to calculate margin
  let gridX = Math.floor((x / containerWidth) * col);
  let gridY = Math.floor(y / (rowHeight + (margin ? margin[1] : 0)));
  //Prevent cards from overflowing the container
  return checkInContainer(gridX, gridY, col, cardWidth);
};

/**
 * Width and height calculations become px
 * @param {Number} w
 * @param {Number} h
 * @param {Number} margin
 * @param {Number} rowHeight
 * @param {Number} cardWidth
 * @returns {Object} Contains wPx, hPx object
 */
export const calWHtoPx = (w, h, margin, rowHeight, calWidth) => {
  const wPx = Math.round(w * calWidth + (w - 1) * margin[0]);
  const hPx = Math.round(h * rowHeight + (h - 1) * margin[1]);

  return { wPx, hPx };
};

/**
 * Pixel width and height become grid width and height
 * @param {Number} pxWidth
 * @param {Number} pxHeight
 * @param {Number} rowHeight
 * @param {Number} cardWidth
 * @returns {Object} Contains w, h object
 */
export const pxToWH = (pxWidth, pxHeight, rowHeight, calWidth) => {
  const width = Math.round(pxWidth / calWidth);
  const height = Math.round(pxHeight / rowHeight);
  return { width, height };
};
