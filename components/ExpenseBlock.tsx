import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { ExpenseType } from "@/types";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";

const ExpenseBlock = ({
  expenseList,
  onPress,
}: {
  expenseList: ExpenseType[];
  onPress?: (name: string) => void;
}) => {
  const renderItem: ListRenderItem<ExpenseType> = ({ item, index }) => {
    if (index === 0 && item.name === "Add Item") {
      return (
        <TouchableOpacity onPress={() => {}}>
          <View style={styles.addItemBtn}>
            <Feather name="plus" size={22} color={"#ccc"} />
          </View>
        </TouchableOpacity>
      );
    }

    const [dollars, cents] = item.amount.split(".");

    return (
      <TouchableOpacity onPress={() => onPress?.(item.name)}>
        <View
          style={[
            styles.expenseBlock,
            {
              backgroundColor:
                item.name === "Food"
                  ? Colors.blue
                  : item.name === "Saving"
                  ? Colors.white
                  : Colors.tintColor,
            },
          ]}
        >
          <Text
            style={[
              styles.expenseBlockTxt1,
              {
                color:
                  item.name === "Food" || item.name === "Saving"
                    ? Colors.black
                    : Colors.white,
              },
            ]}
          >
            {item.name}
          </Text>
          <Text
            style={[
              styles.expenseBlockTxt2,
              {
                color:
                  item.name === "Food" || item.name === "Saving"
                    ? Colors.black
                    : Colors.white,
              },
            ]}
          >
            ${dollars}.<Text style={styles.expenseBlockTxt2Span}>{cents}</Text>
          </Text>
          <View style={styles.expenseBlock3View}>
            <Text
              style={[
                styles.expenseBlockTxt1,
                {
                  color:
                    item.name === "Food" || item.name === "Saving"
                      ? Colors.black
                      : Colors.white,
                },
              ]}
            >
              {item.percentage}%
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const staticItem: ExpenseType[] = [
    {
      id: "0",
      name: "Add Item",
      amount: "0.00",
      percentage: "0",
    },
  ];

  return (
    <View style={{ paddingVertical: 20 }}>
      <FlatList
        data={staticItem.concat(expenseList)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default ExpenseBlock;

const styles = StyleSheet.create({
  addItemBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#666",
    borderStyle: "dashed",
    borderRadius: 10,
    marginRight: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  expenseBlock: {
    backgroundColor: Colors.tintColor,
    width: 100,
    padding: 15,
    borderRadius: 15,
    marginRight: 20,
    gap: 8,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  expenseBlockTxt1: {
    color: Colors.white,
    fontSize: 14,
  },
  expenseBlockTxt2: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  expenseBlockTxt2Span: {
    fontSize: 12,
    fontWeight: "400",
  },
  expenseBlock3View: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 10,
  },
});
