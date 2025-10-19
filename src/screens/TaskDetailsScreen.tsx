import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, updateDoc, getDocs, collection, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { RootStackParamList } from "../../App";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "../styles/TaskDetailsScreen";

type TaskDetailsRouteProp = RouteProp<RootStackParamList, "TaskDetails">;

interface Volunteer {
  id: string;
  name: string;
  selected: boolean;
}

export const TaskDetailsScreen: React.FC = () => {
  const route = useRoute<TaskDetailsRouteProp>();
  const navigation = useNavigation();
  const { task } = route.params;

  const [isCompleted, setIsCompleted] = useState(task.completed);
  const [editing, setEditing] = useState<boolean>(false);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [taskVolunteers, setTaskVolunteers] = useState<string[]>(task.volunteers || []);

  const [newType, setNewType] = useState<string>(task.type ?? "");
  const [newDescription, setNewDescription] = useState<string>(task.description ?? "");

  const parseTaskDeadline = (deadline: any) => {
    if (!deadline) return new Date();
    if (typeof deadline === "object" && "seconds" in deadline) {
      return new Date(deadline.seconds * 1000);
    }
    const parsed = new Date(deadline);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const [deadlineDate, setDeadlineDate] = useState<Date>(parseTaskDeadline(task.deadline));
  const [newDeadline, setNewDeadline] = useState<string>(deadlineDate.toLocaleString());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const volunteerRef = collection(db, "volunteers");
    const unsubscribe = onSnapshot(volunteerRef, (snapshot) => {
      const data: Volunteer[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data() as any;
        return {
          id: docSnap.id,
          name: d.fullName || "Sin nombre",
          selected: d.selected ?? false,
        };
      });

      // Mostrar tanto los disponibles (selected: false) como los que ya pertenecen a la tarea actual
      const filtered = data.filter(
        (v) => !v.selected || taskVolunteers.includes(v.id)
      );
      setVolunteers(filtered);
    });
    return () => unsubscribe();
  }, [taskVolunteers]);

 
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      setDeadlineDate(selectedDate);
    }
  };
  const toggleVolunteer = async (volunteerId: string) => {
  const isSelected = taskVolunteers.includes(volunteerId);

  if (!isSelected && taskVolunteers.length >= task.neededAssistants) {
    Alert.alert("Límite alcanzado", "No puedes agregar más voluntarios.");
    return;
  }

  try {
    const volunteerRef = doc(db, "volunteers", volunteerId);

    if (isSelected) {
      setTaskVolunteers((prev) => prev.filter((id) => id !== volunteerId));
      await updateDoc(volunteerRef, { selected: false });
      console.log(`Volunteer ${volunteerId} -> selected: false`);
    } else {
      setTaskVolunteers((prev) => [...prev, volunteerId]);
      await updateDoc(volunteerRef, { selected: true });
      console.log(`Volunteer ${volunteerId} -> selected: true`);
    }
  } catch (error) {
    console.error("Error updating volunteer selection:", error);
  }
};

  const handleToggleComplete = async () => {
    try {
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, { completed: !isCompleted });
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
        deadline: Timestamp.fromDate(deadlineDate),
        volunteers: taskVolunteers,
        assistants: taskVolunteers.length,
      });

      const volunteerRef = collection(db, "volunteers");
      const allVolunteers = await getDocs(volunteerRef);

      for (const v of allVolunteers.docs) {
        const isInTask = taskVolunteers.includes(v.id);
        await updateDoc(doc(db, "volunteers", v.id), {
          selected: isInTask,
        });
      }

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

          {/* Contenedor verde */}
          <View style={styles.greenContainer}>
            <ScrollView
              style={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120 }}
            >
              {/* Cards normales */}
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

              <View style={styles.card}>
                <View style={styles.cardInner}>
                  <View style={styles.iconPlaceholder}>
                    <MaterialIcons name="event" size={20} color="#1d1b20" />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardLabel}>Fecha límite</Text>
                    <Text style={styles.cardValue}>{task.deadline || "Sin fecha"}</Text>
                  </View>
                </View>
              </View>

              {/* Asistentes */}
              <View style={styles.card}>
                <View style={styles.cardInner}>
                  <View style={styles.iconPlaceholder}>
                    <MaterialIcons name="people" size={20} color="#1d1b20" />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardLabel}>Asistentes</Text>
                    <Text style={styles.cardValue}>
                      {taskVolunteers.length}/{task.neededAssistants}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Mostrar voluntarios (solo en edición) */}
              {editing && (
                <View>
                  <Text style={{ marginLeft: 20, fontWeight: "bold", fontSize: 16 }}>
                    Voluntarios asignados / disponibles
                  </Text>
                  {volunteers.map((v) => (
                    <TouchableOpacity
                      key={v.id}
                      style={{
                        backgroundColor: taskVolunteers.includes(v.id) ? "#b7e4c7" : "#fff",
                        padding: 10,
                        margin: 8,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: "#ccc",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                      onPress={() => toggleVolunteer(v.id)}
                    >
                      <Text>{v.name}</Text>
                      <Text>{taskVolunteers.includes(v.id) ? "✓" : "+"}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Campos de edición */}
              {editing && (
                <View style={styles.editSection}>
                  <View style={styles.editCard}>
                    <Text style={styles.editLabel}>Tipo</Text>
                    <TextInput
                      style={styles.editInput}
                      value={newType}
                      onChangeText={setNewType}
                    />
                  </View>

                  <View style={styles.editCard}>
                    <Text style={styles.editLabel}>Descripción</Text>
                    <TextInput
                      style={[styles.editInput, styles.editInputMultiline]}
                      value={newDescription}
                      onChangeText={setNewDescription}
                      multiline
                    />
                  </View>

                  <View style={styles.editCard}>
                    <Text style={styles.editLabel}>Fecha límite</Text>
                    <TouchableOpacity onPress={() => setShowPicker(true)}>
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
};
