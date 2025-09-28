import React from "react";
import { Link, router } from "expo-router";
import { View, Text, Alert} from "react-native";
import * as Sentry from "@sentry/react-native"

import CustomInput from "@/components/custom-input";
import CustomButton from "@/components/custom-button";

import { signIn } from "@/lib/appwrite";

import {SignInParams} from "@/types";


const SignIn = () => {
    const [isSubmitting, setSubmitting] = React.useState(false);
    const [form, setForm] = React.useState({
        email: "",
        password: "",
    })

    const submit = async () => {
        const { email, password } = form;

        if(!email || !password) {
            Alert.alert("Error","Please enter a valid email address or password" );
            return;
        }

        setSubmitting(true);

        try{
            await signIn({email, password} as SignInParams)
            Alert.alert('Success', 'User signed In Successfully');
            router.replace("/")
        } catch(error: any) {
            Alert.alert('Error', error.message);
            Sentry.captureEvent(error);
        } finally {
            setSubmitting(false);
        }

    }
    return (
        <View className="gap-10 bg-white rounded-lg p-5 mt-">
            <CustomInput
                placeholder="Enter your email"
                value={form.email}
                onChangeText={(text) => setForm((prev) => ({...prev, email: text})) }
                label="Email"
                keyboardType="email-address"
            />
            <CustomInput
                placeholder="Enter your password"
                value={form.password}
                onChangeText={(text) => setForm((prev) => ({...prev, password: text})) }
                label="Password"
                secureTextEntry={true}
            />
            <CustomButton
                title={"Sign In"}
                isLoading={isSubmitting}
                onPress={submit}
            />
            <View className="flex justify-center mt-5 flex-row gap-2">
                <Text className="base-regular text-gray-100">
                    Don't have an account?
                </Text>
                <Link href="/sign-up" className="base-bold text-primary">
                    Sign Up
                </Link>
            </View>
        </View>
    )
}

export default SignIn;