import Link from "next/link"; // Link is used in the data, but not directly in the component JSX

const faqData = [
  {
    question: "How accurate are the summaries?",
    answer:
      "Our AI is trained to extract the most relevant information with high accuracy. Summaries include the most upvoted and engaged-with content, ensuring you get the most valuable insights from any thread.",
  },
  {
    question: "Can I summarize any subreddit?",
    answer:
      "Yes, DigestIt works with any public subreddit and thread. Some quarantined subreddits may have limited functionality.",
  },
  {
    question: "How long does it take to generate a summary?",
    answer:
      "Most summaries are generated in under 10 seconds, though very large threads (10,000+ comments) may take up to 30 seconds to process.",
  },
  {
    question: "Can I customize the summary length?",
    answer:
      "Yes, Pro and Team users can adjust summary length from brief overviews to comprehensive digests, depending on your needs.",
  },
  {
    question: "Is there a browser extension?",
    answer:
      "Yes, we offer Chrome and Firefox extensions that allow you to summarize threads directly while browsing Reddit.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel anytime from your account settings. Your access will continue until the end of your billing period.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm text-orange-500">
              FAQ
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Frequently asked questions
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to know about DigestIt.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-3xl gap-4 py-12">
          {faqData.map((item, index) => (
            <div key={index} className="rounded-lg border p-6">
              <h3 className="text-lg font-bold">{item.question}</h3>
              <p className="mt-2 text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
