export const getGroups = state => state.gridLayout.groups;
export const getLayout = state => state.gridLayout.layout;
export const getCompactType = state => state.gridLayout.compantType;
export const getDefaultLayout = state => state.gridLayout.defaultLayout;
export const getShadowCard = state => state.gridLayout.shadowCard;
export const getCardByID = (groupID, cardID) => state =>
  state.gridLayout.groups
    .find(({ id }) => id === groupID)
    .cards.find(({ id }) => id === cardID);
export const getNextCardID = state => {
  const groups = state.gridLayout.groups;
  if (!groups.length) return 0;
  const ids = groups.flatMap(({ cards }) => cards.map(({ id }) => id));
  const cardsCount = ids.length;
  if (!cardsCount) return 0;
  return ids.sort((a, b) => a - b)[cardsCount - 1] + 1;
};

export const getNextGroupID = state => {
  const groups = state.gridLayout.groups;
  if (!groups.length) return 0;
  const ids = groups.map(({ id }) => id);
  return ids.sort((a, b) => a - b)[groups.length - 1] + 1;
};

export const getCards = groupID => state => {
  const groups = state.gridLayout.groups;
  if (!groups.length) return [];
  const group = groups.find(({ id }) => groupID === id);
  if (!group) return [];
  return group.cards;
};

export const getShadowedCard = state => {
  const groups = state.gridLayout.groups;
  if (!groups.length) return undefined;
  const cards = groups.flatMap(({ cards }) => cards);
  const cardsCount = cards.length;
  if (!cardsCount) return undefined;
  return cards.find(({ isShadow }) => isShadow === true);
};

export const getDraggableTypes = state => state.gridLayout.draggableTypes;
