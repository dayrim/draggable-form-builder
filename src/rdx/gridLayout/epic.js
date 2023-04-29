import * as GR from "rdx/gridLayout/const";
import { ofType } from "redux-observable";
import { mergeMap, catchError, debounceTime } from "rxjs/operators";
import { from, of, merge } from "rxjs";
import { cloneDeep, forEach } from "lodash";
import { calColCount, calColWidth, compactLayoutHorizontal } from "utils";
import { getDefaultLayout } from "rdx/gridLayout";
import { getLayout, getGroups, renderGrid } from "rdx/gridLayout";

export const fetchCurrencies = (action$, state$) =>
  action$.pipe(
    ofType(GR.RENDER_GRID.START),
    debounceTime(500),
    mergeMap(() => {
      let clientWidth;
      const containerDom = document.querySelector(".card-container");
      if (containerDom) {
        clientWidth = containerDom.clientWidth;
      } else {
        return;
      }

      const layout = getLayout(state$.value);
      const groups = getGroups(state$.value);

      const { containerPadding, margin } = layout;
      let newLayout = cloneDeep(layout);
      /*
      This is responsive col count:

      const defaultCalWidth = getDefaultLayout(state$.value).calWidth;
      const windowWidth = window.innerWidth - 60 * 2;
      const col = calColCount(
        defaultCalWidth,
        windowWidth,
        containerPadding,
        margin
      );
      */
      const col = newLayout.col;
      const calWidth = calColWidth(clientWidth, col, containerPadding, margin);

      let newGroups = cloneDeep(groups);
      forEach(newGroups, g => {
        let compactedLayout = compactLayoutHorizontal(g.cards, col);
        g.cards = compactedLayout;
      });
      /*
      This is 
      
      newLayout.calWidth = newLayout.rowHeight = calWidth;
      */
      newLayout.calWidth = calWidth;
      newLayout.col = col;
      newLayout.containerWidth = clientWidth;

      return of({
        type: GR.RENDER_GRID.SUCCESS,
        payload: { groups: newGroups, layout: newLayout }
      });
    })
  );
