import React, { useState, useEffect, useLayoutEffect } from "react";
import { map, range, capitalize, random } from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const GridComponent = () => {
  const generateDOM = () => {
    return map(layouts.lg, (item, i) => {
      return (
        <div key={i} className={item.static ? "static" : ""}>
          {item.static ? (
            <span
              className="text"
              title="This item is static and cannot be removed or resized."
            >
              Static - {i}
            </span>
          ) : (
            <span className="text">{i}</span>
          )}
        </div>
      );
    });
  };
  const initialElements = [1, 2, 3, 4, 5];
  const generateLayout = () => {
    return map(initialElements, (item, i) => {
      var y = Math.ceil(Math.random() * 4) + 1;
      return {
        x: (random(0, 5) * 2) % 12,
        y: Math.floor(i / 6) * y,
        w: 12,
        h: y,
        i: i.toString()
        // static: Math.random() < 0.05
      };
    });
  };
  const [layouts, setLayouts] = useState({ lg: generateLayout() });
  const [breakPoint, setBreakpoinst] = useState("lg");
  const [mounted, setMounted] = useState(false);
  const [compactType, setCompactType] = useState("vertical");

  console.log(breakPoint, "breakPoint");
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div>
      <div
        className="draggable"
        draggable={true}
        unselectable="on"
        // this is a hack for firefox
        // Firefox requires some kind of initialization
        // which we can do by adding this attribute
        // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
        onDragStart={e => e.dataTransfer.setData("text/plain", "")}
      >
        Droppable Element
      </div>
      <ResponsiveReactGridLayout
        className={"layout"}
        rowHeight={30}
        cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
        layouts={layouts}
        onBreakpointChange={setBreakpoinst}
        onDrop={elemParams => {
          alert(
            `Element parameters:\n${JSON.stringify(
              elemParams,
              ["x", "y", "w", "h"],
              2
            )}`
          );
        }}
        // WidthProvider option
        measureBeforeMount={false}
        // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
        // and set `measureBeforeMount={true}`.
        useCSSTransforms={true}
        compactType={compactType}
        preventCollision={!compactType}
        isDroppable={true}
      >
        {generateDOM()}
      </ResponsiveReactGridLayout>
    </div>
  );
};
export default GridComponent;
class DragFromOutsideLayout extends React.Component {
  static defaultProps = {
    className: "layout",
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    initialLayout: generateLayout()
  };

  state = {
    currentBreakpoint: "lg",
    compactType: "vertical",
    mounted: false,
    layouts: { lg: this.props.initialLayout }
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  generateDOM() {
    return map(this.state.layouts.lg, function(l, i) {
      return (
        <div key={i} className={l.static ? "static" : ""}>
          {l.static ? (
            <span
              className="text"
              title="This item is static and cannot be removed or resized."
            >
              Static - {i}
            </span>
          ) : (
            <span className="text">{i}</span>
          )}
        </div>
      );
    });
  }

  onBreakpointChange = breakpoint => {
    this.setState({
      currentBreakpoint: breakpoint
    });
  };

  onCompactTypeChange = () => {
    const { compactType: oldCompactType } = this.state;
    const compactType =
      oldCompactType === "horizontal"
        ? "vertical"
        : oldCompactType === "vertical"
        ? null
        : "horizontal";
    this.setState({ compactType });
  };

  onLayoutChange = (layout, layouts) => {
    this.props.onLayoutChange(layout, layouts);
  };

  onNewLayout = () => {
    this.setState({
      layouts: { lg: generateLayout() }
    });
  };

  onDrop = elemParams => {
    alert(
      `Element parameters:\n${JSON.stringify(
        elemParams,
        ["x", "y", "w", "h"],
        2
      )}`
    );
  };

  render() {
    return (
      <div>
        <div>
          Current Breakpoint: {this.state.currentBreakpoint} (
          {this.props.cols[this.state.currentBreakpoint]} columns)
        </div>
        <div>
          Compaction type:{" "}
          {capitalize(this.state.compactType) || "No Compaction"}
        </div>
        <button onClick={this.onNewLayout}>Generate New Layout</button>
        <button onClick={this.onCompactTypeChange}>
          Change Compaction Type
        </button>
        <div
          className="droppable-element"
          draggable={true}
          unselectable="on"
          // this is a hack for firefox
          // Firefox requires some kind of initialization
          // which we can do by adding this attribute
          // @see https://bugzilla.mozilla.org/show_bug.cgi?id=568313
          onDragStart={e => e.dataTransfer.setData("text/plain", "")}
        >
          Droppable Element
        </div>
        <ResponsiveReactGridLayout
          {...this.props}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          onDrop={this.onDrop}
          // WidthProvider option
          measureBeforeMount={false}
          // I like to have it animate on mount. If you don't, delete `useCSSTransforms` (it's default `true`)
          // and set `measureBeforeMount={true}`.
          useCSSTransforms={this.state.mounted}
          compactType={this.state.compactType}
          preventCollision={!this.state.compactType}
          isDroppable={true}
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

function generateLayout() {
  return map(range(0, 25), function(item, i) {
    var y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: (random(0, 5) * 2) % 12,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      static: Math.random() < 0.05
    };
  });
}
