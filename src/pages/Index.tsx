import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

type MatchStatus = 'finished' | 'live' | 'upcoming';

interface Match {
  id: string;
  division: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: MatchStatus;
  time: string;
  minute?: number;
}

interface Player {
  name: string;
  team: string;
  goals?: number;
  assists?: number;
  rating?: number;
}

const generateLiveMatches = (): Match[] => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  
  const divisions = [
    { name: 'Север-A', teams: ['Murmansk', 'Helsinki', 'Stockholm', 'Bergen'], startHour: 0 },
    { name: 'Запад-A', teams: ['Chicago', 'Turin', 'Cadiz', 'Kingston'], startHour: 0 },
    { name: 'Юг-A', teams: ['Krasnodar', 'Cairo', 'Damascus', 'Aden'], startHour: 0 },
    { name: 'Восток-A', teams: ['Tokyo', 'Seoul', 'Shanghai', 'Manila'], startHour: 0 }
  ];

  const matches: Match[] = [];
  
  divisions.forEach((div) => {
    const matchHour = (currentHour % 6);
    const matchIndex = Math.floor(matchHour / 1);
    const team1 = div.teams[matchIndex % 4];
    const team2 = div.teams[(matchIndex + 1) % 4];
    
    const matchTime = `${String(currentHour).padStart(2, '0')}:00`;
    const isLive = currentMinute < 50;
    
    matches.push({
      id: `${div.name}-current`,
      division: div.name,
      homeTeam: team1,
      awayTeam: team2,
      homeScore: Math.floor(Math.random() * 4),
      awayScore: Math.floor(Math.random() * 4),
      status: isLive ? 'live' : 'finished',
      time: matchTime,
      minute: isLive ? currentMinute : undefined
    });
  });

  return matches;
};

const generateUpcomingMatches = (): Match[] => {
  const currentTime = new Date();
  const nextHour = (currentTime.getHours() + 1) % 24;
  
  const divisions = [
    { name: 'Север-B', teams: ['Glasgow', 'Narvik', 'Edinburgh', 'Riga'] },
    { name: 'Запад-B', teams: ['Cologne', 'Verdun', 'Dakar', 'Tunis'] },
    { name: 'Юг-B', teams: ['Plymouth', 'Makhachkala', 'Lahore', 'Muscat'] },
    { name: 'Восток-B', teams: ['Beijing', 'Cebu', 'Canberra', 'Magadan'] }
  ];

  return divisions.map((div, index) => ({
    id: `${div.name}-next`,
    division: div.name,
    homeTeam: div.teams[0],
    awayTeam: div.teams[1],
    homeScore: 0,
    awayScore: 0,
    status: 'upcoming' as MatchStatus,
    time: `${String(nextHour).padStart(2, '0')}:00`
  }));
};

const topScorers: Player[] = [
  { name: 'Eriksson', team: 'Stockholm', goals: 47 },
  { name: 'Silva', team: 'Turin', goals: 42 },
  { name: 'Nakamura', team: 'Tokyo', goals: 39 },
  { name: 'O\'Connor', team: 'Cork', goals: 38 },
  { name: 'Martinez', team: 'Cadiz', goals: 36 }
];

const topAssisters: Player[] = [
  { name: 'Petrov', team: 'Murmansk', assists: 34 },
  { name: 'Anderson', team: 'Glasgow', assists: 31 },
  { name: 'Chen', team: 'Shanghai', assists: 29 },
  { name: 'Ibrahim', team: 'Cairo', assists: 27 },
  { name: 'Santos', team: 'Lima', assists: 25 }
];

const topRated: Player[] = [
  { name: 'Johansson', team: 'Helsinki', rating: 9.2 },
  { name: 'Volkov', team: 'Krasnodar', rating: 9.1 },
  { name: 'Kim', team: 'Seoul', rating: 8.9 },
  { name: 'Murphy', team: 'Edinburgh', rating: 8.8 },
  { name: 'Garcia', team: 'Mexico', rating: 8.7 }
];

const MatchCard = ({ match }: { match: Match }) => (
  <Card className="p-4 bg-card border-border hover:border-accent transition-colors">
    <div className="flex items-center justify-between mb-3">
      <Badge variant="outline" className="text-xs font-normal">
        {match.division}
      </Badge>
      {match.status === 'live' && (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-accent rounded-full live-pulse" />
          <span className="text-accent text-sm font-medium">{match.minute}'</span>
        </div>
      )}
      {match.status === 'finished' && (
        <Badge variant="secondary" className="text-xs">ЗАВЕРШЕН</Badge>
      )}
      {match.status === 'upcoming' && (
        <span className="text-muted-foreground text-sm">{match.time}</span>
      )}
    </div>
    
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-foreground font-medium">{match.homeTeam}</span>
        {match.status !== 'upcoming' && (
          <span className="text-2xl font-bold text-foreground">{match.homeScore}</span>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-foreground font-medium">{match.awayTeam}</span>
        {match.status !== 'upcoming' && (
          <span className="text-2xl font-bold text-foreground">{match.awayScore}</span>
        )}
      </div>
    </div>
  </Card>
);

const LeaderboardTable = ({ players, type }: { players: Player[], type: 'goals' | 'assists' | 'rating' }) => (
  <div className="space-y-2">
    {players.map((player, index) => (
      <div 
        key={index}
        className="flex items-center justify-between p-4 bg-card border border-border rounded hover:border-accent transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-accent w-8">{index + 1}</span>
          <div>
            <p className="font-semibold text-foreground">{player.name}</p>
            <p className="text-sm text-muted-foreground">{player.team}</p>
          </div>
        </div>
        <span className="text-2xl font-bold text-foreground">
          {type === 'goals' && player.goals}
          {type === 'assists' && player.assists}
          {type === 'rating' && player.rating}
        </span>
      </div>
    ))}
  </div>
);

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [liveMatches] = useState(generateLiveMatches());
  const [upcomingMatches] = useState(generateUpcomingMatches());

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent rounded flex items-center justify-center">
                <Icon name="Trophy" size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">IPFL</h1>
                <p className="text-xs text-muted-foreground">International Professional Football League</p>
              </div>
            </div>
          </div>
          
          <nav className="flex gap-1 mt-4 overflow-x-auto">
            {[
              { id: 'home', label: 'Главная', icon: 'Home' },
              { id: 'live', label: 'Live', icon: 'Radio' },
              { id: 'schedule', label: 'Расписание', icon: 'Calendar' },
              { id: 'divisions', label: 'Дивизоны', icon: 'Grid3x3' },
              { id: 'stats', label: 'Статистика', icon: 'BarChart3' },
              { id: 'news', label: 'Новости', icon: 'Newspaper' }
            ].map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'default' : 'ghost'}
                className={activeSection === section.id ? 'bg-accent hover:bg-accent/90' : ''}
                onClick={() => setActiveSection(section.id)}
              >
                <Icon name={section.icon as any} size={18} className="mr-2" />
                {section.label}
              </Button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeSection === 'home' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-3xl font-bold mb-6 text-foreground">Лидеры сезона</h2>
              <Tabs defaultValue="goals" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
                  <TabsTrigger value="goals" className="data-[state=active]:bg-accent">
                    <Icon name="Target" size={18} className="mr-2" />
                    Голы
                  </TabsTrigger>
                  <TabsTrigger value="assists" className="data-[state=active]:bg-accent">
                    <Icon name="Zap" size={18} className="mr-2" />
                    Ассисты
                  </TabsTrigger>
                  <TabsTrigger value="rating" className="data-[state=active]:bg-accent">
                    <Icon name="Star" size={18} className="mr-2" />
                    Рейтинг
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="goals" className="mt-6">
                  <LeaderboardTable players={topScorers} type="goals" />
                </TabsContent>
                <TabsContent value="assists" className="mt-6">
                  <LeaderboardTable players={topAssisters} type="assists" />
                </TabsContent>
                <TabsContent value="rating" className="mt-6">
                  <LeaderboardTable players={topRated} type="rating" />
                </TabsContent>
              </Tabs>
            </section>
          </div>
        )}

        {activeSection === 'live' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <section>
              <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
                <div className="w-3 h-3 bg-accent rounded-full live-pulse" />
                Идут сейчас
              </h2>
              <div className="grid gap-4">
                {liveMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-6 text-foreground">Следующие матчи</h2>
              <div className="grid gap-4">
                {upcomingMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeSection === 'schedule' && (
          <section>
            <h2 className="text-3xl font-bold mb-6 text-foreground">Расписание</h2>
            <div className="text-center py-12">
              <Icon name="Calendar" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Раздел в разработке</p>
            </div>
          </section>
        )}

        {activeSection === 'divisions' && (
          <section>
            <h2 className="text-3xl font-bold mb-6 text-foreground">Дивизоны</h2>
            <div className="text-center py-12">
              <Icon name="Grid3x3" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Раздел в разработке</p>
            </div>
          </section>
        )}

        {activeSection === 'stats' && (
          <section>
            <h2 className="text-3xl font-bold mb-6 text-foreground">Статистика</h2>
            <div className="text-center py-12">
              <Icon name="BarChart3" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Раздел в разработке</p>
            </div>
          </section>
        )}

        {activeSection === 'news' && (
          <section>
            <h2 className="text-3xl font-bold mb-6 text-foreground">Новости</h2>
            <div className="text-center py-12">
              <Icon name="Newspaper" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Раздел в разработке</p>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">© 2026 International Professional Football League. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
