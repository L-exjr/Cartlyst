import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { COLORS, SPACING, TYPOGRAPHY } from "../utils/theme";
import { commonStyles } from "../utils/styles";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            We&apos;re sorry, but something unexpected happened. Please try
            again.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={this.handleRetry}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.centered,
    backgroundColor: COLORS.background,
    flex: 1,
    padding: SPACING.lg,
  },
  message: {
    color: COLORS.text.secondary,
    ...TYPOGRAPHY.body,
    lineHeight: 24,
    marginBottom: SPACING.xl,
    textAlign: "center",
  },
  retryButton: {
    ...commonStyles.button,
  },
  retryText: {
    ...commonStyles.buttonText,
  },
  title: {
    color: COLORS.error,
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
});

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export default ErrorBoundary;
