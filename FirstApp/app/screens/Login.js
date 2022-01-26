import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';

// formik
import {Formik} from 'formik';
import {View, ActivityIndicator} from 'react-native';

// icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';



import {
    StyledContainer, 
    InnerContainer, 
    PageLogo, 
    PageTitle,
    SubTitle,
    StyledFormArea,
    LeftIcon,
    RightIcon,
    StyledTextInput,
    StyledInputLabel,
    Colors,
    StyledButton,
    ButtonText,
    MsgBox,
    Line,
    ExtraText,
    ExtraView,
    TextLink,
    TextLinkContent
} from '../components/styles';

// Keyboard Avoiding Wrapper
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// API client
import axios from 'axios';

const Login = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    const handleLogin = (credentials, setSubmitting) => {
        handleMessage(null);
        const url = 'https://fierce-citadel-55856.herokuapp.com/user/signin'

        axios
        .post(url, credentials)
        .then((response) => {
            const result = response.data;
            const {message, status, data} = result;

            if (status !== 'SUCCESS') {
                handleMessage(message, status);
            } else {
                navigation.navigate('Welcome', {...data[0]});
            }
            setSubmitting(false);
        })
        .catch(error => {
        console.log(error.JSON());
        setSubmitting(false);
        handleMessage("An error occured, please check your internet connection and try again.");
        })
    }

    const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }

    return (
        <KeyboardAwareScrollView>      
            <StyledContainer>
                <StatusBar style="dark"/>
                <InnerContainer>
                    <PageLogo resizeMode="cover" source={require('../assets/icon1.png')}/>
                    <PageTitle>Tekk mekk</PageTitle>
                    <SubTitle>Account Login</SubTitle>
                    
                    <Formik
                    initialValues={{email: '', password: ''}}
                    onSubmit={(values, {setSubmitting}) => {
                        if (values.email == "" || values.password == "") {
                            handleMessage("please fill in all the fields!");
                            setSubmitting(false);
                        } else {
                            handleLogin(values, setSubmitting);
                        }
                    }}
                    >
                        {({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => (
                            <StyledFormArea>
                                <MyTextInput
                                    label="Email Address"
                                    icon="mail"
                                    placeholder="example@gmail.com"
                                    placeholderTextColor={Colors.darkLight}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    keyboardType="email-address" 
                                />
                                <MyTextInput
                                    label="Password"
                                    icon="lock"
                                    placeholder="* * * * * * *"
                                    placeholderTextColor={Colors.darkLight}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry={hidePassword}
                                    isPassword={true}
                                    hidePassword={hidePassword}
                                    setHidePassword={setHidePassword}
                                />
                                <MsgBox type={messageType}>{message}</MsgBox>
                                {!isSubmitting && (
                                <StyledButton onPress={handleSubmit}>
                                    <ButtonText>
                                        Login
                                    </ButtonText>
                                </StyledButton>
                                )}

                                {isSubmitting && (
                                <StyledButton disabled={true}>
                                    <ActivityIndicator size="large" color={Colors.primary} />
                                </StyledButton>
                                )}

                                <Line />
                                <StyledButton google={true} onPress={handleSubmit}>
                                    <Fontisto name="google" color={Colors.primary} size={25} />
                                    <ButtonText google={true}>
                                        Sign in with Google
                                    </ButtonText>
                                </StyledButton>
                                <ExtraView>
                                    <ExtraText>Don't have an account already? </ExtraText>
                                    <TextLink onPress={() => navigation.navigate("Signup")}>
                                        <TextLinkContent>Signup</TextLinkContent>
                                    </TextLink>
                                </ExtraView>
                            </StyledFormArea>
                            )}

                    </Formik>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAwareScrollView>
    );
};

const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, ...props}) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={Colors.brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props} />
            {isPassword && (
                <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={Colors.darkLight} />
                </RightIcon>
            )}
        </View>
    );
};

export default Login;