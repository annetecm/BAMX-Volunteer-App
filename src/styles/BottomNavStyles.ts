import { StyleSheet } from 'react-native';

export const bottomNavStyles = StyleSheet.create({
  bottomNav: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 25,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    flex: 1,
  },
  
  navItemActive: {
    backgroundColor: '#fff5f0',
  },
  
  navIcon: {
    width: 32,
    height: 32,
    opacity: 0.6,
  },
  
  navIconActive: {
    opacity: 1,
  },
  
  centerNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  centerIcon: {
    backgroundColor: '#ffffff',
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 12,
    marginBottom: 15,
  },
  
  centerIconActive: {
    backgroundColor: '#ff8542',
  },
  
  centerIconImage: {
    width: 65,
    height: 65,
  },
});