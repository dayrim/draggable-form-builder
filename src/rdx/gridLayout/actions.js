import * as GR from "./const";

export const renderGrid = payload => ({
  type: GR.RENDER_GRID.START,
  payload
});

export const beginDrag = payload => ({
  type: GR.BEGIN_DRAG,
  payload
});

export const endDrag = payload => ({
  type: GR.END_DRAG,
  payload
});

export const moveCardInGroup = payload => ({
  type: GR.MOVE_CARD_IN_GROUP,
  payload
});

export const cardDropInGroup = payload => ({
  type: GR.CARD_DROP_IN_GROUP,
  payload
});
export const cardHoverOverGroup = payload => ({
  type: GR.CARD_HOVER_OVER_GROUP,
  payload
});
export const createNewGroup = payload => ({
  type: GR.CREATE_NEW_GROUP,
  payload
});
