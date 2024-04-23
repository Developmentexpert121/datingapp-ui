import {View, Text, Alert, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import Label from '../Label';
import Modal from 'react-native-modal';
import {toggleGlobalModal} from '../../store/reducer/authSliceState';
import {RootState, useAppDispatch, useAppSelector} from '../../store/store';
import MainButton from '../ButtonComponent/MainButton';

const GlobalModal = () => {
  const {showGlobalModal, modalData} = useAppSelector(
    (state: RootState) => state.authSliceState,
  );
  const dispatch = useAppDispatch();
  console.log({modalData});

  return (
    <Modal
      style={{backgroundColor: 'transparent', margin: 0}}
      animationIn="slideInDown"
      isVisible={showGlobalModal}>
      <View style={styles.modal}>
        <View style={styles.modalstyle}>
          {/* {modalData?.cancel ? <CloseInvestIc /> : <InvestIc />} */}
          <Label text={modalData?.label} style={styles.textstyle} />

          <MainButton
            style={{
              width: '85%',
              marginTop: 30,
              // backgroundColor: modalData?.cancel
              //   ? light.colors.cancel
              //   : light.colors.primary,
            }}
            ButtonName={modalData?.text}
            onPress={() => {
              dispatch(toggleGlobalModal({visible: false}));
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default GlobalModal;
const styles = StyleSheet.create({
  textstyle: {
    // width: "50%",
    fontSize: 18,
    // fontWeight: "400",
    lineHeight: 36,
    color: '#071731',
    textAlign: 'center',
    paddingHorizontal: 30,
    marginTop: 20,
  },
  modalstyle: {
    // minHeight: 230,
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
  },
  modalstyle1: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
});
