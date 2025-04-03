"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import SimpleHeader from "@/components/SimpleHeader";
import { Loader2, Copy, Check } from "lucide-react";
import Link from "next/link";

export default function SummaryPage() {
  const [redditUrl, setRedditUrl] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const mockSummary = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent aliquam augue quis nulla cursus tristique. Etiam faucibus eros at commodo vestibulum. Fusce suscipit blandit nisi at varius. Sed et vehicula lectus. Duis faucibus justo at sodales consequat. Suspendisse id ligula augue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam imperdiet nibh nec viverra malesuada. Aliquam gravida pellentesque ultrices.

Aliquam erat volutpat. Pellentesque urna metus, feugiat id elit sed, tempor scelerisque nisl. Vestibulum non orci nulla. Maecenas id augue ligula. Cras risus dolor, malesuada non convallis et, porta et justo. Pellentesque auctor sem quis tellus convallis, nec interdum ante viverra. Nam viverra urna vel nunc tempor gravida. In accumsan leo vitae diam vestibulum aliquet. Interdum et malesuada fames ac ante ipsum primis in faucibus.
Fusce aliquam augue vel condimentum efficitur. Phasellus feugiat tortor eget purus cursus, vitae lacinia turpis hendrerit. Aenean iaculis euismod sagittis. Aliquam suscipit odio quis suscipit ultricies. Nullam elit diam, mollis ac convallis vitae, malesuada at dolor. Etiam finibus nibh at molestie egestas. Nulla semper metus vel ex convallis sagittis. In iaculis velit non tellus tincidunt, id ultricies neque imperdiet. Etiam sed euismod ipsum, eu accumsan urna. Ut porttitor consequat auctor. Etiam eget magna vel erat fermentum sagittis lacinia eget enim.

Ut tellus sem, dapibus nec finibus vitae, mattis et tellus. Praesent efficitur bibendum tortor, eu blandit risus fringilla ac. Aliquam hendrerit ornare turpis, et varius quam consequat id. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce dictum rutrum consectetur. Morbi non quam sed ante elementum condimentum ac sed diam. Nam maximus, eros in tempor pharetra, orci elit vulputate mauris, ut semper neque tellus vel nibh. Morbi commodo hendrerit lectus, a viverra turpis pretium eget. Suspendisse ex velit, consequat sit amet dignissim a, finibus sed nunc. Suspendisse ut faucibus orci, non ultrices arcu. Donec vel turpis enim. Vestibulum pulvinar sit amet purus ac laoreet. Maecenas molestie ligula mauris, sit amet lobortis ligula sagittis at. Integer porttitor, lorem non semper egestas, nulla enim facilisis elit, eget tincidunt erat mauris nec augue. Aenean finibus laoreet nisl sed vehicula.

Suspendisse ut nunc lectus. Proin quis risus tristique, consequat ligula vitae, egestas risus. Sed euismod turpis eros, ut porta ipsum aliquam quis. Fusce lobortis hendrerit tortor non aliquet. Morbi lobortis mattis purus et ornare. In nec condimentum lacus, vitae eleifend lorem. Sed rhoncus urna id fermentum rutrum. Vestibulum sit amet nisi molestie, scelerisque nulla id, pharetra turpis.

Nulla commodo fringilla pulvinar. Maecenas a est condimentum, tempor dolor dapibus, egestas odio. Nullam varius leo eu enim lobortis, id posuere mi condimentum. Praesent non risus ut ligula ullamcorper egestas. Duis gravida nisl metus, in rutrum magna dictum in. Cras id condimentum purus. Ut vitae neque id ipsum cursus commodo. Nunc gravida purus eu purus eleifend, sed aliquam ex malesuada. Integer sed odio ullamcorper, posuere purus ac, commodo nisi. Praesent molestie ex ac tellus ornare dictum. Vivamus mollis iaculis est, et elementum massa convallis sit amet. Vivamus consectetur massa ligula, quis faucibus nibh semper vel.

Nullam facilisis ac ligula tincidunt pretium. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce interdum lorem ut quam ornare aliquet. Nunc egestas finibus dui, vitae mollis est sollicitudin ac. Mauris hendrerit non lectus sed tristique. Aliquam sit amet sollicitudin justo. Phasellus nibh risus, gravida imperdiet felis nec, dapibus feugiat augue. Nunc urna ex, euismod non velit non, vestibulum sagittis lectus. Aenean eu leo pretium dui lobortis lacinia. Nulla et feugiat turpis.

Sed gravida eleifend mauris sollicitudin lobortis. Donec blandit feugiat metus ut vehicula. Phasellus cursus accumsan dolor vitae interdum. Morbi magna mauris, maximus ut sapien nec, eleifend venenatis urna. Pellentesque lacus nisl, euismod sit amet diam id, iaculis mollis eros. In tristique enim et lorem aliquet convallis. Pellentesque sagittis eros sit amet scelerisque commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut mollis leo non dui scelerisque, eu eleifend arcu pulvinar. Duis tempor interdum nulla sit amet cursus. Nullam ut leo vitae massa rhoncus ultrices id quis risus.

Duis non placerat nisl. Nam vitae orci nunc. Vivamus molestie nulla mauris, a dapibus tortor efficitur in. Suspendisse blandit purus nec velit imperdiet convallis. Cras sed lacus sed massa suscipit efficitur nec eu felis. Suspendisse semper felis sit amet sodales volutpat. Curabitur interdum molestie enim a egestas. Proin placerat molestie efficitur. In hac habitasse platea dictumst. Maecenas sagittis augue eget tristique tincidunt. Integer viverra, nisi finibus tincidunt dictum, mauris nisl porta quam, ac varius ipsum dui nec lectus.

Mauris consequat tincidunt odio, ac auctor purus convallis eget. Curabitur ut neque vitae tortor vehicula lobortis a eget ipsum. Sed faucibus, dui quis consequat aliquet, justo neque elementum tellus, in tempor lorem turpis fermentum mauris. Cras dictum at lectus id euismod. Duis sed tempus erat. Duis gravida sapien a erat ornare, vitae euismod est rutrum. Nulla facilisi. Ut finibus imperdiet leo, elementum luctus lacus. Nunc vitae elit turpis. Phasellus dui libero, viverra ut accumsan at, commodo sed risus. Fusce malesuada neque a risus luctus maximus. Vestibulum et lacus nisl. Proin sed dictum orci. Mauris sed feugiat odio.

Nunc lobortis imperdiet nunc at porta. Mauris finibus, nunc eget posuere lacinia, ante risus sollicitudin risus, id iaculis mauris mauris sit amet nunc. Fusce sodales neque sed velit pulvinar, eget convallis dui placerat. Nam semper nibh a accumsan elementum. Cras pretium sapien vitae ornare tincidunt. Maecenas sit amet tempus tortor, eu dictum enim. Quisque venenatis nibh ut rhoncus dignissim. Vivamus in sodales justo. Etiam vel neque et ante elementum gravida ultrices vel odio. Donec vitae leo vitae libero tristique vulputate in eget eros. Nunc at nulla efficitur, bibendum lacus non, bibendum elit. Fusce tincidunt quam quis mauris auctor, placerat porta sapien aliquet. Donec sit amet urna pellentesque, consectetur dolor quis, condimentum felis. Fusce ullamcorper sapien ut erat laoreet, quis aliquet felis sodales. Cras dapibus nec ligula sit amet fermentum. Mauris tortor urna, sollicitudin ac sollicitudin non, imperdiet id ex.

Cras feugiat diam quam, id ultricies mi sodales vel. In hac habitasse platea dictumst. Donec a blandit eros, non dapibus purus. Donec ullamcorper elit metus, eu maximus enim vestibulum non. Nullam commodo diam sit amet risus dignissim posuere id ac tortor. Vivamus quis lectus vitae neque suscipit pharetra. Aenean ornare accumsan nulla, sit amet vulputate augue bibendum nec. Integer non luctus enim. Sed id vestibulum lorem. Nulla facilisi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam fringilla laoreet quam at mollis. In eu auctor orci, eget consectetur mi. Praesent erat orci, dapibus id felis in, egestas ullamcorper nisl. Integer facilisis dolor eu dui venenatis, vel hendrerit nisi tincidunt.

Quisque sit amet lacus id est consequat dignissim. Suspendisse sit amet enim ac quam dignissim iaculis quis nec nibh. Phasellus convallis orci nunc, at sagittis justo semper eu. In hac habitasse platea dictumst. Mauris eu vehicula orci, vitae vestibulum urna. Donec ullamcorper dolor mi, et convallis elit fermentum at. Aenean vitae interdum diam. Aliquam id consequat augue. Nam elit tellus, fermentum et gravida bibendum, vestibulum at metus. Etiam cursus ultricies leo nec ultrices. Quisque consequat leo vitae urna vestibulum, id malesuada lectus scelerisque.

Aliquam erat volutpat. Curabitur non magna euismod lectus luctus ornare. Etiam cursus, turpis in pulvinar faucibus, quam ante volutpat augue, et sodales nisi felis ut est. Pellentesque vitae sodales neque. Nullam vitae tellus turpis. Cras quis feugiat tellus. Nunc nunc mauris, laoreet quis vulputate in, eleifend in nibh. Aliquam id cursus odio. Nulla id fermentum sem, at pretium metus. Vivamus feugiat metus eget est consectetur iaculis. Curabitur massa purus, viverra ac tristique vitae, mollis blandit dui. Suspendisse potenti. Mauris a neque semper, congue metus sed, aliquet turpis. Nullam volutpat ac justo feugiat pharetra. Duis tortor dolor, lacinia quis porta vel, sollicitudin in odio.

Aliquam egestas neque ultricies, iaculis diam sit amet, varius purus. Phasellus sagittis quis enim a tempus. Donec pulvinar mauris purus, ut laoreet urna congue sed. Aenean id arcu ligula. Pellentesque metus neque, eleifend vel magna sit amet, dictum feugiat nunc. Vivamus sodales sapien at dui laoreet gravida. Vivamus a arcu hendrerit, mattis ex vitae, mattis enim. Aenean ultrices sem vitae posuere porta. Nunc eu velit ut ante bibendum bibendum quis quis justo. Fusce enim purus, euismod eu rhoncus quis, ultrices et orci. In cursus id est eu pharetra. Mauris at ante in ex molestie auctor. In rhoncus fringilla porttitor. Proin eros nunc, congue sed ex ut, pulvinar semper ex.

Aliquam vel turpis scelerisque, luctus felis a, finibus odio. Nulla tempus porta purus, et feugiat ipsum viverra vitae. In hac habitasse platea dictumst. Nam vel dignissim est, sit amet porttitor tellus. Praesent a efficitur erat. Mauris ornare, metus sit amet egestas ornare, mi mauris dapibus quam, a auctor ligula risus eu tellus. Morbi ut nunc tortor. Donec sem ex, luctus vitae varius sit amet, bibendum sit amet quam. Etiam commodo elit lacus, et rutrum felis varius non. Proin posuere magna a felis viverra, eget egestas eros finibus. Duis blandit condimentum pellentesque. Vestibulum elementum commodo felis.

Integer malesuada dui neque, non euismod ipsum luctus eu. Proin varius, ex id congue cursus, urna mauris blandit lorem, ut facilisis libero ipsum a nunc. Curabitur ac nunc in nibh feugiat euismod eu et enim. Nullam blandit lacinia quam, quis scelerisque tellus. Pellentesque pellentesque risus vitae odio egestas malesuada. Nullam lacinia, ex a lacinia volutpat, nibh dolor aliquam justo, non vestibulum nunc justo dictum ligula. Nulla porttitor eros quam, vitae dapibus ligula faucibus ac. Aliquam at velit at urna rhoncus interdum.

Nam sollicitudin efficitur sollicitudin. Nam nec nulla tortor. Quisque sed consectetur massa. Donec consectetur a mi sit amet auctor. Aenean ullamcorper nibh enim, et semper dui ornare ac. Aenean ornare mi id nisl aliquet, at malesuada metus fermentum. Mauris magna nulla, dictum porta metus at, semper elementum est. Aliquam et semper enim, non condimentum erat. Etiam interdum tellus id sollicitudin auctor.

Etiam ex orci, aliquet nec erat in, porta gravida velit. Praesent libero metus, fringilla in gravida a, molestie sed nibh. Nam sit amet luctus nibh. Nullam placerat dui in tempor viverra. In hac habitasse platea dictumst. Nullam suscipit, lacus a viverra aliquet, diam tortor pellentesque felis, eu molestie metus lectus fermentum sem. Integer ornare nisi eu libero aliquam, sit amet molestie urna mollis. Donec convallis enim sit amet lacus ullamcorper, lacinia tempor nisi blandit. Integer luctus lectus libero, non pharetra nibh commodo vel. Maecenas eget dictum dolor. Cras placerat tellus erat, ut elementum nunc porta et. Aenean suscipit ullamcorper nunc interdum rhoncus. Nulla ac purus at justo eleifend porttitor. Mauris vel vehicula velit. Duis dolor nunc, scelerisque vitae odio eget, bibendum mattis libero. Etiam sit amet eros et nisl dictum interdum.

Phasellus ut leo neque. Ut elementum tempor ante quis sollicitudin. Praesent nec tristique orci, sit amet vestibulum metus. Pellentesque tincidunt nunc eu nulla viverra, ac rutrum tellus sodales. Phasellus mauris ante, placerat sed tempor sed, mattis ut ipsum. Cras nec nulla consectetur, volutpat metus aliquet, pulvinar nunc. Aenean eleifend justo in nibh dapibus hendrerit. Donec non venenatis mi. Nam pretium mattis orci, eget pharetra ligula molestie dignissim. Donec commodo condimentum orci, sit amet efficitur neque cursus nec. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent vulputate malesuada arcu sed pharetra. Suspendisse potenti. Fusce ac accumsan felis. Praesent dictum rhoncus dui molestie varius. Etiam lacinia nec tortor a placerat.

Phasellus venenatis enim eu volutpat aliquam. Duis vulputate est vel lorem placerat, non maximus libero viverra. Nunc nec tempus quam. Vivamus nec accumsan augue. Ut eu consequat ligula. Ut dictum nisl massa. Quisque nibh felis, tristique vel sagittis at, volutpat id sapien. Mauris venenatis, ipsum nec placerat consequat, ex lectus dictum nisl, in porta nisl nisi vel mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed sagittis condimentum dapibus.

Nam egestas odio lectus. Aenean a leo sollicitudin, convallis ipsum a, condimentum risus. Phasellus congue viverra mollis. Integer vestibulum diam sollicitudin bibendum consectetur. Sed facilisis nisl id gravida convallis. Fusce orci orci, pellentesque vel ornare quis, tristique nec orci. Morbi tempor placerat quam. Pellentesque quis tincidunt velit.

Suspendisse vitae volutpat tortor, sed interdum odio. Sed faucibus sodales consequat. Quisque nec risus nisi. Pellentesque id tellus vitae est imperdiet imperdiet non non felis. Nunc a elit quis magna efficitur imperdiet. Fusce lobortis vulputate nisl, non sollicitudin magna. Suspendisse potenti. Fusce sed molestie ex, et lacinia nulla.

Donec congue nibh vehicula, sagittis mi auctor, sodales sapien. Nulla nec lacinia libero. Nam felis augue, tempor nec ullamcorper vel, tempor eget neque. Curabitur rutrum tristique sapien. Ut nibh libero, porttitor a egestas vitae, scelerisque sit amet tortor. Duis ac rutrum tortor. Nulla varius urna sit amet ligula gravida aliquam. In ornare augue in libero vehicula consequat. Phasellus nec sem a purus pulvinar mattis quis et ipsum. Quisque ligula ante, dignissim sit amet quam consequat, luctus hendrerit ligula.

Mauris euismod commodo turpis non sodales. Vestibulum congue elit leo, tempor elementum dolor tempus id. Mauris eleifend sapien sit amet nunc lobortis, ac dictum risus mollis. Nullam quis ornare ipsum. Nullam cursus tempor tincidunt. Duis auctor libero ultricies est commodo elementum. Quisque ac ante a lacus finibus suscipit ac vitae nisl. Mauris varius ut est nec tincidunt. Aenean aliquam dolor non turpis vulputate tincidunt. In quis nulla sed dui vehicula interdum.
`;

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard
        .writeText(summary)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  const handleSummarize = (event: React.FormEvent) => {
    event.preventDefault();
    setSummary(null);
    setError(null);
    setSubmittedUrl(null);
    setIsCopied(false);
    setIsLoading(true);

    const isValidRedditUrl = redditUrl.includes("reddit.com/r/");

    if (isValidRedditUrl) {
      const currentUrl = redditUrl;
      setTimeout(() => {
        setSummary(mockSummary);
        setSubmittedUrl(currentUrl);
        setIsLoading(false);
      }, 3000);
    } else {
      setError(
        "Please provide a valid Reddit thread URL (e.g., reddit.com/r/...)."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SimpleHeader />
      <main className="flex-1 container mx-auto py-12 px-4 md:px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold tracking-tight text-center">
            Reddit Thread Summarizer
          </h1>
          <p className="text-muted-foreground text-center">
            Paste the URL of a Reddit thread below to get a quick summary.
          </p>

          <form
            onSubmit={handleSummarize}
            className="flex w-full items-center space-x-2"
          >
            <Input
              type="url"
              placeholder="https://www.reddit.com/r/..."
              value={redditUrl}
              onChange={(e) => setRedditUrl(e.target.value)}
              required
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Summarize"
              )}
            </Button>
          </form>

          {error && <p className="text-red-500 text-center">Error: {error}</p>}

          {isLoading && (
            <div className="flex justify-center items-center pt-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="ml-2 text-muted-foreground">
                Generating summary...
              </p>
            </div>
          )}

          {summary && !isLoading && submittedUrl && (
            <Card className="mt-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Summary</CardTitle>
                    <CardDescription className="pt-1">
                      Original thread:
                      <Link
                        href={submittedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-primary text-xs break-all"
                      >
                        {submittedUrl}
                      </Link>
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    aria-label="Copy summary"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {summary}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
