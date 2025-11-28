import React from "react";
import NoPermission from "../NoPermission";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Global error boundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <NoPermission />;
    }
    return this.props.children;
  }
}


