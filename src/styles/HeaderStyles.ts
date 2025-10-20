import { StyleSheet } from 'react-native';

export const headerStyles = StyleSheet.create({
  header: {
    backgroundColor: '#ff9b63',
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 100,
    marginRight: 20,
  },
  headerTextContainer: {
    flex: 1,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 2,
    textAlign: 'left',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    textAlign: 'left',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#ff9b63',
    fontSize: 12,
    fontWeight: '600',
  },
  secondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(224, 123, 79, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  progressText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    textAlign: 'left',
  },
  progressLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    textAlign: 'left',
    lineHeight: 18,
    width: 107,
  },
  calendarWidget: {
    backgroundColor: '#fff',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 30,
    width: 104,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDate: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'left',
  },
});