"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EyeIcon, EyeOffIcon, PlusCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { signup } from "./action";
import {
    isUsernameUnique,
    isEmailUnique,
    getListOfColleges,
    addNewCollege,
} from "./action";
import { useToast } from "@/hooks/use-toast";

interface College {
    id: string;
    name: string;
    location: string;
}

export default function SignupForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [selectedCollege, setSelectedCollege] = useState<College | null>(
        null,
    );
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [colleges, setColleges] = useState<College[]>([]);
    const [open, setOpen] = useState(false);
    const [openAddCollege, setOpenAddCollege] = useState(false);
    const [newCollegeName, setNewCollegeName] = useState("");
    const [newCollegeLocation, setNewCollegeLocation] = useState("");
    const [emailError, setEmailError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const router = useRouter();
    const { toast } = useToast();

    const fetchColleges = useCallback(async () => {
        try {
            const response = await getListOfColleges();
            if (response.success) {
                setColleges(response.data);
            }
        } catch (err) {
            setError("Failed to fetch colleges");
        }
    }, []);

    useEffect(() => {
        fetchColleges();
    }, []);

    const handleEmailBlur = async () => {
        if (!email) return;
        try {
            const isUnique = await isEmailUnique(email);
            if (!isUnique) {
                setEmailError("This email is already registered");
            } else {
                setEmailError("");
            }
        } catch (err) {
            setEmailError("Error checking email availability");
        }
    };

    const handleUsernameBlur = async () => {
        if (!username) return;
        try {
            const isUnique = await isUsernameUnique(username);
            if (!isUnique) {
                setUsernameError("This username is already taken");
            } else {
                setUsernameError("");
            }
        } catch (err) {
            setUsernameError("Error checking username availability");
        }
    };

    const handleConfirmPasswordBlur = () => {
        if (!confirmPassword) return;
        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
        } else {
            setConfirmPasswordError("");
        }
    };

    const handleAddCollege = async () => {
        if (!newCollegeName || !newCollegeLocation) {
            setError("Please fill in all college details");
            return;
        }

        try {
            const data = await addNewCollege(
                newCollegeName,
                newCollegeLocation,
            );
            if (data.data) {
                const newCollege = data.data;
                setColleges((prev) => [...prev, newCollege]);
                setSelectedCollege(newCollege);
                setOpenAddCollege(false);
                setNewCollegeName("");
                setNewCollegeLocation("");
            } else {
                setError("Failed to add new college");
            }
        } catch (err) {
            setError("Failed to add new college");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (emailError || usernameError) {
            setError("Please fix the errors before proceeding");
            return;
        }

        if (!selectedCollege) {
            setError("Please select a college");
            return;
        }

        try {
            const data = await signup(
                name,
                email,
                username,
                password,
                selectedCollege.id,
            );
            toast({
                title: "Sign up Successfully",
                description: "You are being redirected to home page",
            });
            router.push("/home");
        } catch (err) {
            setError("An error occurred during signup");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    className={emailError ? "border-red-500" : ""}
                />
                {emailError && (
                    <p className="text-sm text-red-500">{emailError}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={handleUsernameBlur}
                    className={usernameError ? "border-red-500" : ""}
                />
                {usernameError && (
                    <p className="text-sm text-red-500">{usernameError}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                    <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOffIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                            <EyeIcon className="h-4 w-4 text-gray-400" />
                        )}
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={handleConfirmPasswordBlur}
                        className={confirmPasswordError ? "border-red-500" : ""}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                        }
                    >
                        {showConfirmPassword ? (
                            <EyeOffIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                            <EyeIcon className="h-4 w-4 text-gray-400" />
                        )}
                    </Button>
                </div>
                {confirmPasswordError && (
                    <p className="text-sm text-red-500">
                        {confirmPasswordError}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label>College</Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                        >
                            {selectedCollege
                                ? selectedCollege.name
                                : "Select your college..."}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder="Search college..." />
                            <CommandEmpty>
                                No college found.
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="mt-2 w-full"
                                    onClick={() => setOpenAddCollege(true)}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add New College
                                </Button>
                            </CommandEmpty>
                            <CommandGroup>
                                {colleges.map((college) => (
                                    <CommandItem
                                        key={college.id}
                                        onSelect={() => {
                                            setSelectedCollege(college);
                                            setOpen(false);
                                        }}
                                    >
                                        <div>
                                            <div>{college.name}</div>
                                            <div className="text-sm text-gray-500">
                                                {college.location}
                                            </div>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <Dialog open={openAddCollege} onOpenChange={setOpenAddCollege}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New College</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="collegeName">College Name</Label>
                            <Input
                                id="collegeName"
                                value={newCollegeName}
                                onChange={(e) =>
                                    setNewCollegeName(e.target.value)
                                }
                                placeholder="Enter college name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="collegeLocation">Location</Label>
                            <Input
                                id="collegeLocation"
                                value={newCollegeLocation}
                                onChange={(e) =>
                                    setNewCollegeLocation(e.target.value)
                                }
                                placeholder="Enter college location"
                            />
                        </div>
                        <Button
                            type="button"
                            onClick={handleAddCollege}
                            className="w-full"
                        >
                            Add College
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={!!emailError || !!usernameError}
            >
                Sign up
            </Button>

            <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                >
                    Log in
                </Link>
            </div>
        </form>
    );
}
