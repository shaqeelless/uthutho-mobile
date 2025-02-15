import { StyleSheet, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../config/theme';

interface SearchBarProps {
  searchFrom: string;
  searchTo: string;
  onSearchFromChange: (text: string) => void;
  onSearchToChange: (text: string) => void;
}

export default function SearchBar({
  searchFrom,
  searchTo,
  onSearchFromChange,
  onSearchToChange,
}: SearchBarProps) {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBox}>
        <Ionicons name="location" size={20} color={theme.colors.primary} />
        <TextInput
          style={styles.input}
          placeholder="Search from..."
          value={searchFrom}
          onChangeText={onSearchFromChange}
        />
      </View>
      <View style={styles.searchBox}>
        <Ionicons name="navigate" size={20} color={theme.colors.secondary} />
        <TextInput
          style={styles.input}
          placeholder="Search to..."
          value={searchTo}
          onChangeText={onSearchToChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    gap: 12,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.dark}05`,
    borderRadius: 12,
    padding: 12,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: theme.colors.dark,
  },
}); 