/**
 * Impact checking
 * @param {Object} a
 * @param {Object} b
 * @returns {Boolean} Whether to collide
 */
export const collision = (a, b) => {
  if (
    a.gridx === b.gridx &&
    a.gridy === b.gridy &&
    a.width === b.width &&
    a.height === b.height
  ) {
    return true;
  }
  if (a.gridx + a.width <= b.gridx) return false; //a is to the left of b
  if (a.gridx >= b.gridx + b.width) return false; //a is to the right of b
  if (a.gridy + a.height <= b.gridy) return false; //a is above b
  if (a.gridy >= b.gridy + b.height) return false; //a is below b
  return true;
};
/**
 * Get the first object in the layout that the item collided with
 * @param {Array} layout
 * @param {Object} item
 * @returns {Object||null} Collided item or null
 */
export const getFirstCollison = (layout, item) => {
  for (let i = 0, length = layout.length; i < length; i++) {
    if (collision(layout[i], item)) {
      return layout[i];
    }
  }
  return null;
};
/**
 * Layout detection, recursive detection of whether the moved item and other items collide, if there is a Y coordinate down/X coordinate shift right
 * @param {Array} layout
 * @param {Object} layoutItem
 * @param {String} cardID
 * @param {String} fristItemID
 * @param {String} compactType ('vertical' | 'horizontal') = 'vertical';
 * @returns {Object||null} Collided item or null
 */
export const layoutCheck = (function() {
  const _layoutCheck = function(
    layout,
    layoutItem,
    cardID,
    fristItemID,
    compactType = "vertical"
  ) {
    let keyArr = [];
    let movedItem = [];
    let axis = "gridx";
    if (compactType === "vertical") {
      axis = "gridy";
    }
    // console.log(compactType, "compactType");
    // console.log(movedItem, "movedItem");
    let newlayout = layout.map((item, index) => {
      if (item.id !== cardID) {
        if (collision(item, layoutItem)) {
          // console.log("collision detection");
          //Collision detection, whether there is a block collision with the current card
          keyArr.push(item.id);
          let offsetXY = item[axis] + 1;
          // The mobile module is located in the loop detection block
          let widthOrHeight = 0;
          if (axis === "gridx") {
            widthOrHeight = item.width;
          } else {
            widthOrHeight = item.height;
          }
          //Determine the coordinates of the current card and the width of the target card/Whether there is overlap in height to prevent overlap
          if (
            layoutItem[axis] > item[axis] &&
            layoutItem[axis] < item[axis] + widthOrHeight
          ) {
            offsetXY = item[axis];
          }
          let newItem = { ...item };
          newItem[axis] = offsetXY;
          // console.log(`Item ${JSON.stringify(newItem)}  Offset ${offsetXY}`);
          movedItem.push(newItem);
          return newItem;
        }
      } else if (fristItemID === cardID) {
        return { ...item, ...layoutItem };
      }
      return item;
    });
    //Cycle through all the cards that have been moved, all related cards affected by collision detection, and all abscissas/Ordinate offset
    for (let c = 0, length = movedItem.length; c < length; c++) {
      newlayout = _layoutCheck(
        newlayout,
        movedItem[c],
        keyArr[c],
        fristItemID,
        compactType
      );
    }

    return newlayout;
  };
  return _layoutCheck;
})();
