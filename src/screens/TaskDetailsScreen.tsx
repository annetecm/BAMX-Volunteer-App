import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { RootStackParamList } from "../../App";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../styles/TaskDetailsScreen";

type TaskDetailsRouteProp = RouteProp<RootStackParamList, "TaskDetails">;

export const TaskDetailsScreen: React.FC = () => {
  const route = useRoute<TaskDetailsRouteProp>();
  const navigation = useNavigation();
  const { task } = route.params;

  const [isCompleted, setIsCompleted] = useState(task.completed);
  const [editing, setEditing] = useState<boolean>(false);

  const [newType, setNewType] = useState<string>(task.type ?? "");
  const [newDescription, setNewDescription] = useState<string>(task.description ?? "");
  const [newDeadline, setNewDeadline] = useState<string>(task.deadline ?? "");

  const [showPicker, setShowPicker] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState<Date>(
    task.deadline ? new Date(task.deadline) : new Date()
  );

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      setDeadlineDate(selectedDate);
      setNewDeadline(selectedDate.toLocaleString());
    }
  };

  const handleToggleComplete = async () => {
    try {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, {
        completed: !isCompleted,
      });
      setIsCompleted(!isCompleted);
      Alert.alert(
        "Tarea actualizada",
        !isCompleted ? "La tarea se marcó como completada" : "La tarea se marcó como pendiente"
      );
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      Alert.alert("Error", "No se pudo actualizar la tarea");
    }
  };

  const handleSaveEdits = async () => {
    if (!newType.trim() || !newDescription.trim()) {
      Alert.alert("Campos vacíos", "Por favor completa el tipo y la descripción.");
      return;
    }

    try {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, {
        type: newType.trim(),
        description: newDescription.trim(),
        deadline: newDeadline.trim(),
      });
      Alert.alert("Éxito", "Cambios guardados correctamente.");
      setEditing(false);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      Alert.alert("Error", "No se pudieron guardar los cambios.");
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
  <View style={{ flex: 1, backgroundColor: "#ff9b63" }}>
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ff9b63" }}>
      <View style={styles.view}>
        {/* Header naranja */}
        <View style={styles.headerBackground} />

        {/* Botón de regreso */}
        <TouchableOpacity style={styles.backNavs} onPress={handleBackPress}>
          <View style={styles.backNavsChild}>
            <Text style={styles.backArrow}>‹</Text>
          </View>
        </TouchableOpacity>

        {/* Título principal */}
        <Text style={styles.mainTitle}>Detalles de la tarea</Text>

        <View style={{ position: "absolute", top: 140, left: 0, right: 0, bottom: 0, backgroundColor: "#ebfff4" }} />
        {/* Contenedor verde con bordes redondeados */}
        <View style={styles.greenContainer}>
          <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }} // evita solapamiento con botones
          >
            {/* Card 1 - Tipo */}
            <View style={styles.card}>
              <View style={styles.cardInner}>
                <View style={styles.iconPlaceholder}>
                  <MaterialIcons name="category" size={20} color="#1d1b20" />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardLabel}>Tipo</Text>
                  <Text style={styles.cardValue}>{task.type || "Sin tipo"}</Text>
                </View>
              </View>
            </View>

            {/* Card 2 - Descripción */}
            <View style={styles.card}>
              <View style={styles.cardInner}>
                <View style={styles.iconPlaceholder}>
                  <MaterialIcons name="description" size={20} color="#1d1b20" />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardLabel}>Descripción</Text>
                  <Text style={styles.cardValue}>{task.description || "Sin descripción"}</Text>
                </View>
              </View>
            </View>

            {/* Card 3 - Fecha límite */}
            <View style={styles.card}>
              <View style={styles.cardInner}>
                <View style={styles.iconPlaceholder}>
                  <MaterialIcons name="event" size={20} color="#1d1b20" />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardLabel}>Fecha límite</Text>
                  <Text style={styles.cardValue}>{task.deadline}</Text>
                </View>
              </View>
            </View>

            {/* Card 4 - Asistentes */}
            <View style={styles.card}>
              <View style={styles.cardInner}>
                <View style={styles.iconPlaceholder}>
                  <MaterialIcons name="people" size={20} color="#1d1b20" />
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardLabel}>Asistentes</Text>
                  <Text style={styles.cardValue}>
                    {task.assistants}/{task.neededAssistants}
                  </Text>
                </View>
              </View>
            </View>

            {/* Sección de edición */}
            {editing && (
              <View style={styles.editSection}>
                <View style={styles.editCard}>
                  <Text style={styles.editLabel}>Tipo</Text>
                  <TextInput
                    style={styles.editInput}
                    value={newType}
                    onChangeText={setNewType}
                    placeholder="Tipo de tarea"
                    placeholderTextColor="#999"
                  />
                </View>

                <View style={styles.editCard}>
                  <Text style={styles.editLabel}>Descripción</Text>
                  <TextInput
                    style={[styles.editInput, styles.editInputMultiline]}
                    value={newDescription}
                    onChangeText={setNewDescription}
                    placeholder="Descripción"
                    placeholderTextColor="#999"
                    multiline
                  />
                </View>

                <View style={styles.editCard}>
                  <Text style={styles.editLabel}>Fecha límite</Text>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowPicker(true)}
                  >
                    <Text style={styles.dateText}>
                      {deadlineDate.toLocaleString()}
                    </Text>
                  </TouchableOpacity>

                  {showPicker && (
                    <DateTimePicker
                      value={deadlineDate}
                      mode="datetime"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={handleDateChange}
                      minimumDate={new Date()}
                    />
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Botones flotantes */}
        <TouchableOpacity
          style={[styles.fabButton, styles.completeButton]}
          onPress={handleToggleComplete}
        >
          <MaterialIcons
            name={isCompleted ? "check-circle" : "check"}
            size={28}
            color="#fff"
          />
        </TouchableOpacity>

        {!editing ? (
          <TouchableOpacity
            style={[styles.fabButton, styles.editButton]}
            onPress={() => setEditing(true)}
          >
            <MaterialIcons name="edit" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.fabButton, styles.saveButton]}
            onPress={handleSaveEdits}
          >
            <MaterialIcons name="save" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  </View>
);
}