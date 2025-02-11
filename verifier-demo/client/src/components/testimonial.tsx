import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

interface TestimonialCardProps {
  name: string;
  role: string;
  testimonial: string;
  avatarUrl: string;
}

export function TestimonialCard({
  name,
  role,
  testimonial,
  avatarUrl,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="w-[280px] h-[300px] mx-2 flex flex-col justify-between">
        <CardContent className="pt-4 pb-2 px-4">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar>
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback>
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{name}</p>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>
          </div>
          <blockquote className="text-sm italic">"{testimonial}"</blockquote>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function TestimonialsCarousel() {
  const controls = useAnimation();
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    const animate = async () => {
      await controls.start({
        x: ["0%", "-100%"],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        },
      });
    };

    animate();

    return () => {
      controls.stop();
    };
  }, [controls]);

  return (
    <div
      className="w-full overflow-hidden relative"
      aria-label="Customer Testimonials"
    >
      <motion.div className="flex" animate={controls}>
        {duplicatedTestimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </motion.div>
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  );
}

const testimonials = [
  {
    name: "Michael Rodriguez",
    role: "Small Business Owner",
    testimonial:
      "M26's loan application process is incredibly straightforward. I got approved for my business loan in record time!",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    testimonial:
      "The seamless login process at M26 is a game-changer. I can access my accounts securely with just a few taps.",
    avatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Emily Watson",
    role: "Freelance Designer",
    testimonial:
      "I'm amazed by the number of features M26 offers. From budgeting tools to investment options, they have it all!",
    avatarUrl:
      "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "James Kim",
    role: "Retiree",
    testimonial:
      "As someone who's not tech-savvy, I appreciate how easy M26 makes it to manage my finances. Their customer support is top-notch too!",
    avatarUrl:
      "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Lisa Nguyen",
    role: "Healthcare Professional",
    testimonial:
      "The M26 app is so intuitive. I can check my balance, pay bills, and even apply for a loan, all while on my lunch break!",
    avatarUrl:
      "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
