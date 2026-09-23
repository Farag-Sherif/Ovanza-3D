import { Component, type ReactNode } from "react";

/** Guards the 3D canvas: if WebGL is unavailable or three.js throws,
 *  the site keeps working with the static gradient background. */
export default class ThreeGuard extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static checkWebGL(): boolean {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
      );
    } catch {
      return false;
    }
  }

  componentDidCatch() {
    this.setState({ failed: true });
  }

  render() {
    if (this.state.failed || !ThreeGuard.checkWebGL()) return null;
    return this.props.children;
  }
}
