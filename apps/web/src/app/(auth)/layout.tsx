import Image from "next/image";
import { Card } from "@/components/ui/card";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="flex items-center justify-center p-6">
                <Card className="w-full max-w-6xl overflow-hidden shadow-2xl rounded-2xl">
                    <div className="flex flex-col-reverse md:flex-row">
                        {/* Form Section */}
                        <div className="md:w-1/2 p-8 lg:p-12 bg-white flex flex-col justify-center">
                            <div className="max-w-md mx-auto w-full">
                                <h1 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 mb-4">
                                    Campus Connect
                                </h1>
                                <p className="text-slate-600 mb-8 text-base lg:text-lg leading-relaxed">
                                    Join your college community, share
                                    experiences, and stay connected.
                                </p>
                                {children}
                            </div>
                        </div>

                        {/* Image Section */}
                        <div className="md:w-1/2 relative min-h-[300px] md:min-h-[600px] bg-gradient-to-br from-blue-600 to-blue-800">
                            <div className="absolute inset-0 opacity-90">
                                <Image
                                    src="/image.png"
                                    alt="Campus illustration"
                                    width={1792}
                                    height={1024}
                                    className="object-cover h-full w-full"
                                    priority
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-blue-800/30 mix-blend-overlay" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
