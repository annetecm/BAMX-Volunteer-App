import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, StyleSheet } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { addTaskStyles } from "../styles/AddTaskStyles";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { RootStackParamList } from "../../App";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';



type TaskDetailsRouteProp = RouteProp<RootStackParamList, "TaskDetails">;

export const TaskDetailsScreen: React.FC = () => {

  const route = useRoute<TaskDetailsRouteProp>();
  const navigation = useNavigation();
  const { task } = route.params;

  const [isCompleted, setIsCompleted] = useState(task.completed);
  const [editing, setEditing] = useState<boolean>(false);

  const [newType, setNewType] = useState<string>(task.type ?? "");
  const [newDescription, setNewDescription] = useState<string>(
    task.description ?? ""
  );
  const [newDeadline, setNewDeadline] = useState<string>(task.deadline ?? "");

  const [showPicker, setShowPicker] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState<Date>(
  task.deadline ? new Date(task.deadline) : new Date()
  );

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      setDeadlineDate(selectedDate);
      // Aquí actualizas el campo string también
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

  return (
    <ScrollView style={addTaskStyles.container}>
      <View style={addTaskStyles.orangeContainer2}>
        <Text style={addTaskStyles.mainTitle}>Detalles de la tarea</Text>

        <View style={addTaskStyles.inputRow}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Tipo:</Text>
          <Text style={[addTaskStyles.input, { marginLeft: 10 }]}>
            {task.type || "Sin tipo"}
          </Text>
        </View>

        <View style={addTaskStyles.inputRow}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Descripción:</Text>
          <Text style={[addTaskStyles.input, { marginLeft: 10 }]}>
            {task.description || "Sin descripción"}
          </Text>
        </View>

        <View style={addTaskStyles.inputRow}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Fecha límite:</Text>
          <Text style={[addTaskStyles.input, { marginLeft: 10 }]}>
            {task.deadline}
          </Text>
        </View>

        <View style={addTaskStyles.inputRow}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Asistentes:</Text>
          <Text style={[addTaskStyles.input, { marginLeft: 10 }]}>
            {task.assistants}/{task.neededAssistants}
          </Text>
        </View>

        {/* para editar */}
        {editing && (
          <>
            <View style={styles.editRow}>
              <Text style={styles.editLabel}>Tipo</Text>
              <TextInput
                style={styles.editInput}
                value={newType}
                onChangeText={setNewType}
                placeholder="Tipo de tarea"
              />
            </View>

            <View style={styles.editRow}>
              <Text style={styles.editLabel}>Descripción</Text>
              <TextInput
                style={[styles.editInput, { height: 90 }]}
                value={newDescription}
                onChangeText={setNewDescription}
                placeholder="Descripción"
                multiline
              />
            </View>

            <View style={styles.editRow}>
              <Text style={styles.editLabel}>Fecha límite</Text>
              <TouchableOpacity
                style={[styles.editInput, { justifyContent: "center" }]}
                onPress={() => setShowPicker(true)}
              >
                <Text style={{ color: "#fff" }}>
                  {deadlineDate.toLocaleString()}
                </Text>
              </TouchableOpacity>

              {/* El carrusel de fecha */}
              {showPicker && (
                <DateTimePicker
                  value={deadlineDate}
                  mode="datetime"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateChange}
                  minimumDate={new Date()} // evita fechas pasadas
                />
              )}
            </View>
          </>
        )}

        {/* Botón de completar */}
        <TouchableOpacity
          style={[styles.fabButton, styles.completeButton]}
          onPress={handleToggleComplete}
        >
          <MaterialIcons name="check" size={28} color="#fff" />
        </TouchableOpacity>

        {/* Botón editar/guardar */}
        {!editing ? (
          <TouchableOpacity
            style={[styles.fabButton, styles.editButton]}
            onPress={() => setEditing(true)}
          >
            <Text style={styles.fabIcon}>✎</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.fabButton, styles.saveButton]}
            onPress={handleSaveEdits}
          >
            <Text style={styles.fabIcon}>💾</Text>
          </TouchableOpacity>
        )}
        
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  row: {
    marginBottom: 14,
  },
  label: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 6,
  },
  value: {
    color: "#fff",
    fontSize: 16,
  },
  editRow: {
    marginBottom: 14,
  },
  editLabel: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 6,
  },
  editInput: {
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  editButton: {
    backgroundColor: '#FF9B63', 
    position: 'absolute',
    bottom: 45,
    right: 45,  
  },
  completeButton: {
    backgroundColor: '#FF9B63', 

  },
  fabIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#FF9B63', // verde (guardar)
  },
});
