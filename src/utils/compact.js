import { layoutBottom, getFirstCollison } from "utils";
/**
 * Sort the items in the layout, according to gridx from small to large, gridy from small to large
 * @param {Array} layout Layout array
 * @returns {Array} New sorted layout
 */
const sortLayout = layout => {
  return [].concat(layout).sort((a, b) => {
    if (a.gridy > b.gridy || (a.gridy === b.gridy && a.gridx > b.gridx)) {
      return 1;
    } else if (a.gridy === b.gridy && a.gridx === b.gridx) {
      return 0;
    }
    return -1;
  });
};
/**
 * Compress individual elements so that each element is next to the border or adjacent elements
 * @param {Array} finishedLayout The compressed elements will be put here to compare whether each element in the future needs to be compressed.
 * @param {Object} item
 * @returns {Object} item Returns the item at the new coordinate position
 */
const compactItem = (finishedLayout, item) => {
  const newItem = { ...item };
  if (finishedLayout.length === 0) {
    return { ...newItem, gridy: 0 };
  }

  while (true) {
    let FirstCollison = getFirstCollison(finishedLayout, newItem);
    if (FirstCollison) {
      newItem.gridy = FirstCollison.gridy + FirstCollison.height;
      return newItem;
    }
    newItem.gridy--;
    if (newItem.gridy < 0) return { ...newItem, gridy: 0 }; //Hit the border, gridy is set to 0
  }
};
/**
 * Vertical compression, so that each element will be next to the border or adjacent elements
 * @param {Array} layout
 * @param {Object} movingItem
 * @returns {Array} layout Latest layout
 */
export const compactLayout = function(layout, movingItem) {
  let sorted = sortLayout(layout);
  const compareList = [];
  const needCompact = Array(layout.length);

  for (let i = 0, length = sorted.length; i < length; i++) {
    let finished = compactItem(compareList, sorted[i]);
    compareList.push(finished);
    needCompact[i] = finished;
  }
  return needCompact;
};
/**
 * Get free card placement area
 * @param {Array} finishedLayout
 * @param {Object} item
 * @param {Int} cols
 * @returns {Object} Card placement
 */
const getSpaceArea = (finishedLayout, item, cols) => {
  const newItem = { ...item };
  if (finishedLayout.length === 0) {
    return newItem;
  }

  let FirstCollison = getFirstCollison(finishedLayout, newItem);
  if (FirstCollison) {
    newItem.gridx++;
    if (newItem.gridx + item.width > cols) {
      newItem.gridx = 0;
      newItem.gridy++;
    }
    return getSpaceArea(finishedLayout, newItem, cols);
  } else {
    return newItem;
  }
};

/**
 * horizontal compact Layout Version2.1
 * Horizontal compression version 2.1
 * First sort the cards by x and y,
 * Place a card to detect collision or beyond the boundary starting from 0, 0. If there is a collision, then grix = 0, y + 1, and check for collision again.
 * Where to optimize: If the coordinates of the card in motion should always be within a range, it should not be dragged anywhere
 * @param {Array} layout
 * @param {Int} cols
 * @param {String} movingCardID Moving elements
 * @returns {layout} Latest layout
 */
export const compactLayoutHorizontal = function(layout, cols, movingCardID) {
  let sorted = sortLayout(layout);
  const compareList = [];
  const needCompact = Array(layout.length);
  let arr = [];
  let moveCard;
  //Perform coordinate reset, except for moving cards
  for (let i = 0; i < sorted.length; i++) {
    if (movingCardID === sorted[i].id) {
      moveCard = sorted[i];
      continue;
    }
    arr.push(sorted[i]);
  }
  //Get the largest y value in the current group and assign it to the mobile card to prevent the group Y value from becoming infinitely large
  if (moveCard) {
    moveCard.gridy = Math.min(layoutBottom(arr), moveCard.gridy);
  }
  //Reset coordinates of non-moving cards
  for (let i = 0; i < sorted.length; i++) {
    if (movingCardID !== sorted[i].id) {
      sorted[i].gridy = 0;
      sorted[i].gridx = 0;
    }
  }
  let rowCount = 0;
  //Reposition, except for moving cards
  for (let i = 0, length = sorted.length; i < length; i++) {
    let finished;
    if (movingCardID === sorted[i].id) {
      finished = sorted[i];
    } else {
      finished = getSpaceArea(compareList, sorted[i], cols);
    }
    compareList.push(finished);
    needCompact[i] = finished;
  }
  return needCompact;
};

/**
 * horizontal compact Layout Version2.0
 * Horizontal compression version 2.0
 * First sort the cards by x and y,
 * Place a card to detect collision or beyond the boundary starting from 0, 0. If there is a collision, then grix = 0, y + 1, and check for collision again.
 * @param {Array} layout
 * @param {Int} cols
 * @returns {layout} Latest layout
 */
// export const compactLayoutHorizontal = function(layout, cols) {
// 	let sorted = sortLayout(layout);
// 	const compareList = [];
// 	const needCompact = Array(layout.length);

// 	for (let i = 0; i < sorted.length; i++) {
// 		sorted[i].gridy = 0;
// 		sorted[i].gridx = 0;
// 	}
// 	let rowCount = 0;
// 	for (let i = 0, length = sorted.length; i < length; i++) {
// 		let finished = getSpaceArea(compareList, sorted[i], cols);
// 		compareList.push(finished);
// 		needCompact[i] = finished;
// 	}
// 	return needCompact;
// };

// export const compactLayoutHorizontal = function( layout, cols ){
//     let sorted = sortLayout(layout);
//     const compareList = []
//     const needCompact = Array(layout.length)

//     for(let i=0;i<sorted.length;i++){
//         sorted[i].gridy = 0;
//         sorted[i].gridx = 0;
//     }
//     let rowCount = 0;
//     for(let i=0, length=sorted.length; i<length; i++){
//         //Get the maximum accumulated width of a row of existing cards
//         const compareListRow = _.filter(compareList,(c)=>{
//             return c.gridy == rowCount
//         });
//         const ll = layoutHorizontalRowLength(compareListRow);
//         //If the current maximum width plus the current card width is greater than cols, then put in the next line,
//         //Otherwise set gridx
//         if(ll+sorted[i].width > cols){
//             rowCount++;
//             sorted[i].gridy = rowCount;
//         }else{
//             sorted[i].gridy = rowCount;
//             sorted[i].gridx = ll;
//         }
//         compareList.push(sorted[i]);
//         needCompact[i] = sorted[i];
//     }
//     return needCompact;
// }
