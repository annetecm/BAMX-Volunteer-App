import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { taskStyles } from '../styles/TaskStyles';

// Types
export interface Task {
  id: string;
  title: string;
  deadline: string;
  completed: boolean;
  assistants?: number;
}

export interface Volunteer {
  id: string;
  name: string;
}

// Task Filter Component
interface TaskFilterProps {
  activeFilter: 'pendientes' | 'listo';
  onFilterChange: (filter: 'pendientes' | 'listo') => void;
  completedCount: number;
  totalCount: number;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({ 
  activeFilter, 
  onFilterChange, 
  completedCount, 
  totalCount 
}) => {
  return (
    <View style={taskStyles.taskFilter}>
      <View style={taskStyles.taskInfo}>
        <Text style={taskStyles.taskTitle}>Tus tareas</Text>
        <Text style={taskStyles.taskCount}>({completedCount}/{totalCount}) Completadas</Text>
      </View>
      
      <View style={taskStyles.filterButtons}>
        <TouchableOpacity
          style={[
            taskStyles.filterButton,
            activeFilter === 'pendientes' && taskStyles.activeFilterButton,
          ]}
          onPress={() => onFilterChange('pendientes')}
        >
          <Text style={[
            taskStyles.filterButtonText,
            activeFilter === 'pendientes' && taskStyles.activeFilterText,
          ]}>
            Pendientes
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            taskStyles.filterButton,
            activeFilter === 'listo' && taskStyles.activeFilterButton,
          ]}
          onPress={() => onFilterChange('listo')}
        >
          <Text style={[
            taskStyles.filterButtonText,
            activeFilter === 'listo' && taskStyles.activeFilterText,
          ]}>
            Listo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Task Item Component
interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  showAssistants?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, showAssistants = false }) => {
  return (
    <View style={taskStyles.taskItem}>
      <View style={taskStyles.taskCheckbox}>
        <TouchableOpacity
          style={[
            taskStyles.checkbox,
            task.completed && taskStyles.checkedBox,
          ]}
          onPress={() => onToggle(task.id)}
        >
          {task.completed && <Text style={taskStyles.checkmark}>✓</Text>}
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={[
          taskStyles.radioButton,
          task.completed && taskStyles.radioButtonSelected,
        ]}
        onPress={() => onToggle(task.id)}
      >
        <View style={[
          taskStyles.radioInner,
          task.completed && taskStyles.radioInnerSelected,
        ]} />
      </TouchableOpacity>
      
      <View style={taskStyles.taskContent}>
        <Text style={taskStyles.taskText}>{task.title}</Text>
        <View style={taskStyles.taskMeta}>
          <View style={taskStyles.deadlineDot} />
          <Text style={taskStyles.deadlineText}>
            Fecha límite <Text style={taskStyles.deadlineDate}>{task.deadline}</Text>
          </Text>
        </View>
        {showAssistants && task.assistants && (
          <Text style={taskStyles.assistantsText}>({task.assistants}/4) asistencias</Text>
        )}
      </View>
      
      {showAssistants && (
        <TouchableOpacity style={taskStyles.taskAction}>
          <Text style={taskStyles.actionIcon}>→</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Admin Task Item Component
interface AdminTaskItemProps {
  task: Task;
  onPress: () => void;
}

export const AdminTaskItem: React.FC<AdminTaskItemProps> = ({ task, onPress }) => {
  return (
    <TouchableOpacity style={taskStyles.adminTaskItem} onPress={onPress}>
      <View style={taskStyles.adminTaskIcon}>
        <Text style={taskStyles.adminTaskIconText}>−</Text>
      </View>
      <View style={taskStyles.adminTaskContent}>
        <Text style={taskStyles.adminTaskTitle}>{task.title}</Text>
        {task.assistants && (
          <Text style={taskStyles.adminTaskAssistants}>({task.assistants}/4) asistencias</Text>
        )}
      </View>
      <TouchableOpacity style={taskStyles.adminTaskAction}>
        <Text style={taskStyles.adminActionIcon}>→</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// Volunteer Item Component
interface VolunteerItemProps {
  volunteer: Volunteer;
  onPress: () => void;
}

export const VolunteerItem: React.FC<VolunteerItemProps> = ({ volunteer, onPress }) => {
  return (
    <TouchableOpacity style={taskStyles.volunteerItem} onPress={onPress}>
      <View style={taskStyles.volunteerIcon}>
        <Text style={taskStyles.volunteerIconText}>−</Text>
      </View>
      <Text style={taskStyles.volunteerName}>{volunteer.name}</Text>
    </TouchableOpacity>
  );
};