import * as GR from "rdx/gridLayout/const";
import mockData from "mock";
import { cloneDeep, forEach, remove } from "lodash";

import { getCardByID } from "rdx/gridLayout";
import {
  calGridXY,
  layoutCheck,
  compactLayout,
  compactLayoutHorizontal,
  setPropertyValueForCards
} from "utils";
import { getShadowCard, getNextGroupID } from "./selectors";

export const initState = {
  compactType: "vertical",
  defaultLayout: {
    containerWidth: 0,
    containerHeight: 0,
    calWidth: 0,
    rowHeight: 0,
    col: 20,
    margin: [10, 10],
    containerPadding: [0, 0]
  },
  layout: {
    containerWidth: 0,
    containerHeight: 0,
    calWidth: 0,
    rowHeight: 40,
    col: 20,
    margin: [10, 10],
    containerPadding: [0, 0]
  },
  shadowCard: undefined,
  draggableTypes: {}
};

export default (state = {}, { payload, type }) => {
  switch (type) {
    case GR.RENDER_GRID.SUCCESS: {
      return { ...state, layout: payload.layout, groups: payload.groups };
    }
    case GR.BEGIN_DRAG: {
      if (payload.shadowCard) {
        return {
          ...state,
          shadowCard: payload.shadowCard
        };
      } else {
        const groupIndex = state.groups.findIndex(
          ({ id }) => id === payload.groupID
        );

        const cardIndex = state.groups[groupIndex].cards.findIndex(
          ({ id }) => id === payload.id
        );
        let groups = cloneDeep(state.groups);
        groups[groupIndex].cards[cardIndex] = {
          ...groups[groupIndex].cards[cardIndex],
          isShadow: true
        };
        const shadowCard = cloneDeep(groups[groupIndex].cards[cardIndex]);
        return {
          ...state,
          shadowCard,
          groups
        };
      }
    }

    case GR.END_DRAG: {
      let cardIndex = -1;
      let groupIndex = -1;
      state.groups.forEach(({ cards }, currentGroupIndx) => {
        const searchResult = cards.findIndex(({ id }) => id === payload.id);
        if (searchResult => 0) {
          groupIndex = currentGroupIndx;
          cardIndex = searchResult;
        }
      });

      if (cardIndex >= 0) {
        let groups = cloneDeep(state.groups);
        groups[groupIndex].cards[cardIndex] = {
          ...groups[groupIndex].cards[cardIndex],
          isShadow: false
        };
        return { ...state, shadowCard: undefined, groups };
      } else {
        // let groups = cloneDeep(state.groups);
        // forEach(groups, (g, index) => {
        //   remove(g.cards, a => {
        //     return a.isShadow === true;
        //   });
        // });
        return { ...state, shadowCard: undefined };
      }
    }

    case GR.MOVE_CARD_IN_GROUP: {
      /**
       * Drag the card to move on the group
       * @param {Number} payload.groupID ID of group being hover over
       * @param {Number} payload.cardID ID of card being dragged
       * @param {Number} payload.x The x-axis position of the webpage where the current element is located, in px
       * @param {Number} payload.y The y-axis position of the web page where the current element is located, in px
       **/

      let groups = cloneDeep(state.groups);
      let shadowCard = cloneDeep(getShadowCard({ gridLayout: state }));
      const { margin, containerWidth, col, rowHeight } = state.layout;

      // Calculate the current grid coordinates for shadow card
      const { gridX, gridY } = calGridXY(
        payload.x,
        payload.y,
        shadowCard.width,
        margin,
        containerWidth,
        col,
        rowHeight
      );
      if (gridX === shadowCard.gridx && gridY === shadowCard.gridy) {
        return state;
      }
      const groupIndex = state.groups.findIndex(
        ({ id }) => id === payload.groupID
      );

      // //First determine if the same cards exist in the group
      // const cardid = shadowCard.id;

      // Delete the shadow card
      forEach(groups, (g, index) => {
        remove(g.cards, a => {
          return a.isShadow === true;
        });
      });

      shadowCard = { ...shadowCard, gridx: gridX, gridy: gridY };
      //Add shadow card
      groups[groupIndex].cards.push(shadowCard);

      // Get the latest layout in the current group
      const newlayout = layoutCheck(
        groups[groupIndex].cards,
        shadowCard,
        shadowCard.id,
        shadowCard.id,
        state.compactType
      );

      //Compress the layout within the current group
      let compactedLayout;
      if (state.compactType === "horizontal") {
        compactedLayout = compactLayoutHorizontal(
          newlayout,
          state.layout.col,
          shadowCard.id
        );
      } else if (state.compactType === "vertical") {
        compactedLayout = compactLayout(newlayout, shadowCard);
      }

      //Update the group object
      groups[groupIndex].cards = compactedLayout;

      return {
        ...state,
        shadowCard,
        groups
      };
    }
    case GR.CREATE_NEW_GROUP: {
      const groups = cloneDeep(state.groups);
      // const nextGroupID = getNextGroupID({ gridLayout: state });
      // console.log(nextGroupID)
      groups.push({ id: payload.groupID, type: "Group", cards: [] });
      return {
        ...state,
        groups
      };
    }
    case GR.CARD_DROP_IN_GROUP: {
      /**
       * Free card to group
       **/

      let groups = cloneDeep(state.groups);
      //Make shadow cards in all groups non-shadow
      setPropertyValueForCards(groups, "isShadow", false);
      //Resizing the layout horizontally within the target group
      forEach(groups, (g, targetGroupIndex) => {
        if (state.compactType === "horizontal") {
          let compactedLayout = compactLayoutHorizontal(
            groups[targetGroupIndex].cards,
            state.layout.col
          );
          groups[targetGroupIndex].cards = compactedLayout;
        } else if (state.compactType === "vertical") {
          let compactedLayout = compactLayout(groups[targetGroupIndex].cards);
          groups[targetGroupIndex].cards = compactedLayout;
        }
      });
      return {
        ...state,
        shadowCard: undefined,
        groups
      };
    }
    case GR.CARD_HOVER_OVER_GROUP: {
      if (!payload.isOver) {
        return {
          ...state,
          shadowCard: {
            ...state.shadowCard,
            isOver: payload.isOver,
            groupID: undefined
          }
        };
      }
      return {
        ...state,
        shadowCard: {
          ...state.shadowCard,
          isOver: payload.isOver,
          groupID: payload.groupID
        }
      };
    }
    default: {
      return state;
    }
  }
};
