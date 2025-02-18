import imgUrl from "@/assets/smile.jpg";
import { Footer } from "@/components/footer";
import { TestimonialsCarousel } from "@/components/testimonial";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const parentVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const testimonialsVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export default function Index() {
  const [showCarousel, setShowCarousel] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCarousel(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <motion.section
        className="bg-secondary !mt-0 py-6"
        variants={parentVariants}
        initial="hidden"
        animate="show"
      >
        <div className="grid grid-cols-[1fr_10fr_1fr] w-full min-h-[55vh] py-4">
          <div className="col-start-2 grid grid-cols-2 h-full gap-8">
            <motion.div className="flex justify-center items-center">
              <motion.div
                className="text-left space-y-4"
                variants={childVariants}
              >
                <h1 className="text-6xl font-bold">
                  The bank you'll <br /> love to bank with.
                </h1>
                <h2 className="text-xl font-light">
                  Fast, secure and reliable.
                  <br />
                  Apply for a loan lightning-fast thanks to the power of
                  blobkchain-backed Self-Sovereign Identity!
                </h2>
                <Link to="/apply-for-loan">
                  <Button size="lg">Apply for a loan now!</Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex justify-center items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6 rounded-xl">
                <img
                  src={imgUrl}
                  alt="Bank illustration"
                  className="rounded-md object-cover"
                />
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="py-12"
        variants={testimonialsVariants}
        initial="hidden"
        animate="show"
      >
        <div className="container mx-auto px-4">
          <motion.h2
            variants={childVariants}
            className="text-4xl font-bold text-center mb-8"
          >
            What Our Customers Say
          </motion.h2>
          <motion.p
            variants={childVariants}
            className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto"
          >
            Discover why customers love M26 Bank. From our easy-to-use interface
            to our quick loan applications, we're committed to making banking
            simple and efficient for you.
          </motion.p>
          <motion.div variants={childVariants}>
            {!showCarousel && <Skeleton className="w-full h-[300px]" />}
            {showCarousel && <TestimonialsCarousel />}
          </motion.div>
        </div>
      </motion.section>
      <Footer />
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
});
