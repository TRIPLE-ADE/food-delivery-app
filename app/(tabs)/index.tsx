import { Fragment} from "react";
import { Text, View, FlatList, Pressable, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import cn from "clsx"
import * as Sentry from '@sentry/react-native';

import CartButton from "@/components/cart-button";

import { offers, images } from "@/constants"
import useAuthStore from "@/store/auth.store";

export default function Index() {
    const { user } = useAuthStore();

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-800">
            <FlatList
                data={offers}
                contentContainerClassName="pb-28 px-5"
                renderItem={({ item, index }) => {
                    const isEven: boolean = index % 2 === 0
                    return (
                        <View>
                            <Pressable
                                className={cn("offer-card", isEven ? "flex-row-reverse" : "flex-row")}
                                style={{backgroundColor: item.color}}
                                android_ripple={{ color: "#ffff22"}}
                            >
                                {({pressed}) => (
                                    <Fragment>
                                        <View className={"h-full w-1/2"}>
                                            <Image source={item.image} className={"size-full"} resizeMode={"contain"} />
                                        </View>

                                        <View className={cn("offer-card__info", isEven ? "pl-10" : "pr-10")}>
                                            <Text className="h1-bold text-white leading-tight">
                                                {item.title}
                                            </Text>
                                            <Image
                                                className="size-10"
                                                resizeMode="contain"
                                                tintColor="#fff"
                                                source={images.arrowRight}
                                            />
                                        </View>
                                    </Fragment>
                                )}
                            </Pressable>
                        </View>
                    )
                }}
                ListHeaderComponent={() => (
                    <View className="flex-row flex-between w-full my-5">
                        <View className="flex-start">
                            <Text className="small-bold text-primary">Deliver To</Text>
                            <TouchableOpacity className={"flex-row flex-center mt-0.5 gap-x-1"}>
                                <Text className={"paragraph-bold text-dark-100"}>Croatia</Text>
                                <Image source={images.arrowDown} resizeMode={"contain"} className={"size-3"} />
                            </TouchableOpacity>
                        </View>
                        <CartButton />
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
