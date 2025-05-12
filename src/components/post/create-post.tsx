"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { PenLine, Smile, ImageIcon, SendHorizontal, Loader2 } from "lucide-react";

const formSchema = z.object({
  content: z.string().min(1, { message: "Content is required" }),
});

interface CreatePostProps {
  onPostCreated: () => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/posts/create", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (response.ok) {
        form.reset();
        onPostCreated();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  } 

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <PenLine className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Create Post</h3>
          </div>
          
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        placeholder="What's on your mind?" 
                        className="min-h-[120px] resize-none text-base focus-visible:ring-primary/50" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button type="button" size="icon" variant="ghost" className="rounded-full h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10">
                    <ImageIcon className="h-5 w-5" />
                    <span className="sr-only">Add image</span>
                  </Button>
                  <Button type="button" size="icon" variant="ghost" className="rounded-full h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10">
                    <Smile className="h-5 w-5" />
                    <span className="sr-only">Add emoji</span>
                  </Button>
                </div>
                
                <Button 
                  type="submit" 
                  className="rounded-full px-4 gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <SendHorizontal className="h-4 w-4" />
                      <span>Post</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
