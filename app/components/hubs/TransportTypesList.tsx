import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TransportType } from '../../config/constants';
import theme from '../../config/theme';

interface TransportTypesListProps {
  transportTypes: TransportType[];
  selectedType: TransportType | null;
  onSelectType: (type: TransportType) => void;
}

export default function TransportTypesList({ 
  transportTypes, 
  selectedType, 
  onSelectType 
}: TransportTypesListProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Transport</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {transportTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeCard,
              selectedType?.id === type.id && styles.selectedCard,
            ]}
            onPress={() => onSelectType(type)}>
            <Ionicons 
              name={type.icon} 
              size={24} 
              color={theme.colors.secondary} 
            />
            <View style={styles.typeInfo}>
              <Text style={styles.typeName}>{type.name}</Text>
              <Text style={styles.operatorName}>{type.operator}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: theme.colors.dark,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    width: 200,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: `${theme.colors.secondary}10`,
    borderColor: theme.colors.secondary,
    borderWidth: 1,
  },
  typeInfo: {
    marginLeft: 12,
  },
  typeName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.dark,
  },
  operatorName: {
    fontSize: 14,
    color: theme.colors.gray,
  },
}); 