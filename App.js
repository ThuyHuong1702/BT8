import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './context/AuthContext';


const Stack = createStackNavigator();


const ValidateUSPhoneNumber = (phoneNumber) => {
  const regExp = /^\d{10}$/; // Kiểm tra số điện thoại gồm 10 chữ số
  return regExp.test(phoneNumber);
};

// Hàm định dạng lại số điện thoại
const formatPhoneNumber = (phoneNumber) => {
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  if (cleanNumber.length <= 3) return cleanNumber;
  if (cleanNumber.length <= 6) return `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(3)}`;
  return `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(3, 6)}-${cleanNumber.slice(6, 10)}`;
};

const SubmitButton = ({ isValid, handlePress }) => {
  return (
    <TouchableOpacity
      style={[styles.button, isValid ? styles.buttonEnabled : styles.buttonDisabled]}
      onPress={handlePress}
      disabled={!isValid}
    >
      <Text style={styles.buttonText}>Tiếp tục</Text>
    </TouchableOpacity>
  );
};

const PhoneInput = ({ phoneNumber, handleInputChange, isValid }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, isValid ? styles.inputValid : styles.inputInvalid]}
        placeholder="Nhập số điện thoại của bạn"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={handleInputChange}
        placeholderTextColor="#A9A9A9" 
      />
      <Text style={[styles.validationMessage, { color: isValid ? 'green' : 'red' }]}>
        {isValid ? "Hợp lệ" : "Không hợp lệ"}
      </Text>
    </View>
  );
};


const SignInScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const { login } = useAuth();

  const handleSubmit = () => {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    login({ phoneNumber: formattedNumber });
    navigation.navigate('Home');
  };

  const isValidPhoneNumber = ValidateUSPhoneNumber(phoneNumber); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <PhoneInput phoneNumber={phoneNumber} handleInputChange={setPhoneNumber} isValid={isValidPhoneNumber} />
      <SubmitButton isValid={isValidPhoneNumber} handlePress={handleSubmit} />
    </View>
  );
};


const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const handleLogout = () => {
    logout();
    setIsLoggedOut(true);
  };

  const handleGoToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
    setIsLoggedOut(false);
  };

  return (
    <View style={styles.container}>
      {isLoggedOut ? (
        <>
          <Text style={styles.message}>Vui lòng đăng nhập</Text>
          <Button title="Đi đến Đăng nhập" onPress={handleGoToLogin} />
        </>
      ) : user ? (
        <>
          <Text style={styles.message}>Chào mừng, {user.phoneNumber}!</Text>
          <Button title="Đăng xuất" onPress={handleLogout} />
        </>
      ) : (
        <Text style={styles.message}>Vui lòng đăng nhập</Text>
      )}
    </View>
  );
};


export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Đăng nhập', headerTitleAlign: 'center' }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Trang chủ', headerTitleAlign: 'center' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // Màu nền
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333', // Màu chữ tiêu đề
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 5,
    backgroundColor: '#FFFFFF', // Màu nền của input
    shadowColor: '#000', // Đổ bóng
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  inputValid: {
    borderColor: 'green', // Màu xanh khi hợp lệ
  },
  inputInvalid: {
    borderColor: 'red', // Màu đỏ khi không hợp lệ
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Set width to fit within container
  },
  buttonEnabled: {
    backgroundColor: '#007bff',
  },
  buttonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  validationMessage: {
    fontSize: 14,
    marginBottom: 5, // Giảm khoảng cách giữa thông báo và input
  },
  message: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
});
