import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

export function ProgressBar({ current, total }) {
  const progress = (current / total) * 100;

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress}%`,
    };
  }, [progress]);

  return (
    <View style={styles.progressBar}>
      <Animated.View style={[styles.progress, progressStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  progressBar: {
    overflow: "hidden",
    backgroundColor: "#bfe0f8",
    height: 15,
    borderRadius: 4,
    marginVertical: 5,
  },
  progress: {
    backgroundColor: "#1779d6",
    height: "100%",
    width: "100%",
  },
});