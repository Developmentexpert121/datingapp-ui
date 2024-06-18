import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
interface modalData {
  visible: any;
  onRequestClose: any;
  onPress: any;
  onPress1: any;
}
const BlockModal: React.FC<modalData> = ({
  visible,
  onRequestClose,
  onPress,
  onPress1,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Block User</Text>
          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>Block</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={onPress1}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BlockModal;
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Sansation-Bold',
  },
  button: {
    width: '90%',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#FF0000',
    marginVertical: 5,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Sansation-Bold',
    textAlign: 'center',
  },
});
