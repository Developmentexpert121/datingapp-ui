import {View, Text, Modal, StyleSheet} from 'react-native';
import React from 'react';
import MainButton from '../ButtonComponent/MainButton';
import Label from '../../screens/SettingsSection/Label';

type Props = {
  modalOpen: any;
  CancelButton: any;
  SubscribeButton: any;
  text: any;
};
const SubscribeModal = ({
  modalOpen,
  CancelButton,
  SubscribeButton,
  text,
}: Props) => {
  return (
    <Modal
      style={{backgroundColor: 'transparent', margin: 0}}
      //@ts-ignore
      isVisible={modalOpen}
      animationIn="slideInDown"
      animationOut="slideOutDown"
      animationInTiming={600}
      animationOutTiming={1000}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={1000}>
      <View style={styles.modal}>
        <View style={styles.modalstyle}>
          <Label text={text} style={styles.textstyle} />

          <MainButton
            style={{
              width: '85%',
              marginTop: 30,
            }}
            ButtonName="Subscribe!"
            onPress={SubscribeButton}
          />
          <MainButton
            style={{
              width: '85%',
              marginTop: 30,
            }}
            ButtonName="Cancel"
            onPress={CancelButton}
          />
        </View>
      </View>
    </Modal>
  );
};

export default SubscribeModal;

const styles = StyleSheet.create({
  textstyle: {
    fontSize: 18,
    lineHeight: 36,
    color: '#071731',
    textAlign: 'center',
    paddingHorizontal: 30,
    marginTop: 20,
  },
  modalstyle: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 20,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },
});
