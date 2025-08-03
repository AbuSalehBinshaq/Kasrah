import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/useLanguage";
import { DarkModeProvider } from "@/hooks/useDarkMode";
import { Layout } from "@/components/Layout";
import Home from "@/pages/home";
import Matches from "@/pages/matches";
import Transfers from "@/pages/transfers";
import NewsPage from "@/pages/news";
import More from "@/pages/more";
import AdminPanel from "@/pages/admin";
import AdminNews from "@/pages/admin-news";
import NewsDetail from "@/pages/news-detail";
import PlayerDetail from "@/pages/player-detail";
import UserGuide from "@/pages/user-guide";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/matches" component={Matches} />
        <Route path="/transfers" component={Transfers} />
        <Route path="/news" component={NewsPage} />
        <Route path="/more" component={More} />
        <Route path="/admin" component={AdminPanel} />
        <Route path="/admin/news" component={AdminNews} />
        <Route path="/news/:id" component={NewsDetail} />
        <Route path="/player/:id" component={PlayerDetail} />
        <Route path="/user-guide" component={UserGuide} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <DarkModeProvider>
            <Toaster />
            <Router />
          </DarkModeProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
