"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { createTweet, getpresignedUrl } from "./action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { ImagePlus, X, PlusCircle, MinusCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "./Spinner";

interface Poll {
    text: string;
    multipleOptions: boolean;
    option: Array<string>;
}

interface CreatePostFormProps {
    user: {
        avatar: string | null;
        name: string;
        username: string;
    };
    userId: string;
}

export function CreatePostForm({ user, userId }: CreatePostFormProps) {
    const [text, setText] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isPollActive, setIsPollActive] = useState(false);
    const [poll, setPoll] = useState<Poll>({
        text: "",
        multipleOptions: false,
        option: ["", ""],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setIsUploading(true);
            const newImages = await Promise.all(
                Array.from(e.target.files).map(async (file) => {
                    const { presignedUrl, imageUrl } = await getpresignedUrl(
                        file.name,
                        file.type,
                    );
                    await fetch(presignedUrl, { method: "PUT", body: file });
                    return imageUrl;
                }),
            );
            setImages([...images, ...newImages]);
            setIsUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const togglePoll = () => {
        setIsPollActive(!isPollActive);
        if (!isPollActive) {
            setImages([]);
            setText("");
        }
    };

    const addPollOption = () => {
        setPoll({ ...poll, option: [...poll.option, ""] });
    };

    const removePollOption = (index: number) => {
        setPoll({ ...poll, option: poll.option.filter((_, i) => i !== index) });
    };

    const handlePollOptionChange = (index: number, value: string) => {
        const newOptions = [...poll.option];
        newOptions[index] = value;
        setPoll({ ...poll, option: newOptions });
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            let response;
            if (isPollActive) {
                response = await createTweet(userId, isAnonymous, { poll });
            } else {
                response = await createTweet(userId, isAnonymous, {
                    post: { text, imageUrls: images },
                });
            }
            if (response.success) {
                toast({
                    title: "Success",
                    description: "Post created successfully!",
                });
                setText("");
                setImages([]);
                setIsPollActive(false);
                setPoll({ text: "", multipleOptions: false, option: ["", ""] });
            } else {
                toast({
                    title: "Error",
                    description: response.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create post",
                variant: "destructive",
            });
        }
        setIsLoading(false);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <Avatar>
                    <AvatarImage
                        src={
                            isAnonymous
                                ? "/anonymous.png"
                                : user.avatar || undefined
                        }
                    />
                    <AvatarFallback>
                        {isAnonymous ? "A" : user.name[0] || user.username[0]}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-lg font-semibold">
                        {isAnonymous ? "Anonymous" : user.name}
                    </h2>
                    {!isAnonymous && (
                        <p className="text-sm text-gray-500">
                            @{user.username}
                        </p>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {!isPollActive && (
                    <Textarea
                        placeholder="What's happening?"
                        value={text}
                        onChange={handleTextChange}
                        className="w-full mb-4 resize-none"
                        rows={3}
                    />
                )}
                {isPollActive && (
                    <div className="space-y-4">
                        <Input
                            placeholder="Ask a question..."
                            value={poll.text}
                            onChange={(e) =>
                                setPoll({ ...poll, text: e.target.value })
                            }
                            className="w-full"
                        />
                        {poll.option.map((option, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2"
                            >
                                <Input
                                    placeholder={`Option ${index + 1}`}
                                    value={option}
                                    onChange={(e) =>
                                        handlePollOptionChange(
                                            index,
                                            e.target.value,
                                        )
                                    }
                                    className="flex-grow"
                                />
                                {index > 1 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removePollOption(index)}
                                    >
                                        <MinusCircle className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            onClick={addPollOption}
                            disabled={poll.option.length >= 4}
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Option
                        </Button>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="multiple-options"
                                checked={poll.multipleOptions}
                                onCheckedChange={(checked) =>
                                    setPoll({
                                        ...poll,
                                        multipleOptions: checked,
                                    })
                                }
                            />
                            <Label htmlFor="multiple-options">
                                Allow multiple selections
                            </Label>
                        </div>
                    </div>
                )}
                {((!isPollActive && images.length > 0) || isUploading) && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {images.map((img, index) => (
                            <div key={index} className="relative">
                                <Image
                                    src={img}
                                    alt={`Uploaded ${index + 1}`}
                                    width={300}
                                    height={300}
                                    className="w-full h-32 object-contain rounded-md"
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1"
                                    onClick={() => removeImage(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {isUploading && <Spinner />}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    {!isPollActive && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading}
                        >
                            <ImagePlus className="h-4 w-4" />
                        </Button>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        multiple
                        className="hidden"
                    />
                    <Button
                        variant="ghost"
                        onClick={togglePoll}
                        disabled={
                            isLoading || images.length > 0 || text.length > 0
                        }
                    >
                        {isPollActive ? "Cancel Poll" : "Create Poll"}
                    </Button>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="anonymous"
                            checked={isAnonymous}
                            onCheckedChange={setIsAnonymous}
                        />
                        <Label htmlFor="anonymous">Post anonymously</Label>
                    </div>
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={
                        isLoading ||
                        (!isPollActive && !text && images.length === 0) ||
                        (isPollActive && !poll.text)
                    }
                >
                    {isLoading ? "Posting..." : "Post"}
                </Button>
            </CardFooter>
        </Card>
    );
}
