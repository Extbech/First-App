import React from 'react';
import { StatusBar } from 'expo-status-bar';

import {
    InnerContainer, 
    PageTitle,
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,
    Line,
    WelcomeContainer,
    WelcomeImage,
    Avatar
} from '../components/styles';



const Welcome = ({navigation, route}) => {
    const {name, email} = route.params;
    return (
        <>
            <StatusBar style="dark"/>
            <InnerContainer>
                <WelcomeImage resizeMode="cover" source={require('../assets/icon1.png')}/>              
                <WelcomeContainer>
                    <PageTitle welcome={true}>Welcome buddy!</PageTitle>
                    <SubTitle welcome={true}>{name || 'Benjamin Chandler'}</SubTitle>
                    <SubTitle welcome={true}>{email || 'Benjamin.Chandler@gmail.com'}</SubTitle>
                        <StyledFormArea>
                        <Avatar resizeMode="cover" source={require('../assets/icon.png')}/>
                            <Line />
                            <StyledButton onPress={() => {navigation.navigate("Login")}}>
                                <ButtonText>Logout</ButtonText>
                            </StyledButton>                            
                        </StyledFormArea>
                </WelcomeContainer>
            </InnerContainer>
        </>
    );
};


export default Welcome;