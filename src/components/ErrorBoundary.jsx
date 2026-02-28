import { Component } from "react";

/**
 * Top-level error boundary.
 * Catches render-phase errors in any child component tree and shows a
 * graceful recovery screen instead of a blank page.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In production you could forward this to an error-tracking service
    // (e.g. Sentry). Suppressing console output here keeps the bundle
    // clean while preserving the stack in non-production environments.
    if (import.meta.env.DEV) {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 24px",
            fontFamily: "var(--font-display, system-ui, sans-serif)",
            background: "var(--color-bg-app, #f4f5f9)",
            textAlign: "center",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 48 }}>🌿</span>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "var(--color-text-primary, #0f172a)",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--color-text-secondary, #475569)",
              maxWidth: 340,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            An unexpected error occurred. Refresh the page to start again — your
            device&rsquo;s data is not affected.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 8,
              padding: "12px 32px",
              borderRadius: 100,
              border: "none",
              background: "var(--color-green-primary, #22c55e)",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
