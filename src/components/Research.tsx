import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import DocumentPreview from '@/components/DocumentPreview';

interface ResearchTemplate {
  id: number;
  title: string;
  description: string;
  template: string;
  category: string;
  icon: string;
}

const Research: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showTemplates, setShowTemplates] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<ResearchTemplate | null>(null);
  const [copiedTemplateId, setCopiedTemplateId] = useState<number | null>(null);

  const researchTemplates: ResearchTemplate[] = [
    {
      id: 0,
      title: 'Blank Document',
      description: 'Start with a clean slate',
      template: `# Untitled Document

## Introduction

Start writing your content here...

## Section 1

Add your content...

## Section 2

Add your content...

## Conclusion

Summarize your findings...`,
      category: 'General',
      icon: '📄',
    },
    {
      id: 1,
      title: 'Market Research Report',
      description: 'Comprehensive market analysis template',
      template: `# Market Research Report

## Executive Summary
- Key findings overview
- Market size and growth projections
- Main recommendations

## 1. Market Overview
### 1.1 Industry Background
### 1.2 Market Size & Growth
### 1.3 Market Segmentation

## 2. Competitive Analysis
### 2.1 Key Players
### 2.2 Market Share
### 2.3 Competitive Positioning

## 3. Customer Analysis
### 3.1 Target Demographics
### 3.2 Customer Needs & Pain Points
### 3.3 Buying Behavior

## 4. Trends & Opportunities
### 4.1 Emerging Trends
### 4.2 Market Opportunities
### 4.3 Challenges & Threats

## 5. Recommendations
### 5.1 Strategic Actions
### 5.2 Implementation Plan

## Appendix
- Data sources
- Methodology`,
      category: 'Business',
      icon: '📊',
    },
    {
      id: 2,
      title: 'SWOT Analysis Report',
      description: 'Strategic analysis framework document',
      template: `# SWOT Analysis Report

## Executive Summary
- Analysis overview
- Key strategic insights
- Priority recommendations

## 1. Internal Analysis
### 1.1 Strengths
- **Strength 1**: [Description]
- **Strength 2**: [Description]
- **Strength 3**: [Description]

### 1.2 Weaknesses
- **Weakness 1**: [Description]
- **Weakness 2**: [Description]
- **Weakness 3**: [Description]

## 2. External Analysis
### 2.1 Opportunities
- **Opportunity 1**: [Description]
- **Opportunity 2**: [Description]
- **Opportunity 3**: [Description]

### 2.2 Threats
- **Threat 1**: [Description]
- **Threat 2**: [Description]
- **Threat 3**: [Description]

## 3. Strategic Insights
### 3.1 SO Strategies (Strength-Opportunity)
### 3.2 ST Strategies (Strength-Threat)
### 3.3 WO Strategies (Weakness-Opportunity)
### 3.4 WT Strategies (Weakness-Threat)

## 4. Action Plan
### Priority initiatives
### Timeline
### Resource requirements`,
      category: 'Strategy',
      icon: '🎯',
    },
    {
      id: 3,
      title: 'Customer Research Report',
      description: 'User insights and behavior analysis',
      template: `# Customer Research Report

## Executive Summary
- Research objectives
- Key findings
- Actionable insights

## 1. Research Methodology
### 1.1 Research Design
### 1.2 Sample Size & Demographics
### 1.3 Data Collection Methods

## 2. Customer Profile
### 2.1 Demographics
- Age range
- Geographic location
- Income level
- Education

### 2.2 Psychographics
- Lifestyle
- Values & attitudes
- Interests

## 3. Customer Behavior
### 3.1 Purchase Patterns
### 3.2 Decision-Making Process
### 3.3 Channel Preferences

## 4. Customer Needs & Pain Points
### 4.1 Primary Needs
### 4.2 Unmet Needs
### 4.3 Pain Points

## 5. Customer Satisfaction
### 5.1 Satisfaction Metrics
### 5.2 Net Promoter Score (NPS)
### 5.3 Feedback Analysis

## 6. Recommendations
### 6.1 Product/Service Improvements
### 6.2 Marketing Strategies
### 6.3 Customer Experience Enhancement`,
      category: 'Marketing',
      icon: '👥',
    },
    {
      id: 4,
      title: 'Technology Trends Report',
      description: 'Emerging technology and innovation analysis',
      template: `# Technology Trends Report

## Executive Summary
- Report scope
- Key technology trends
- Strategic implications

## 1. Technology Landscape
### 1.1 Current State
### 1.2 Evolution Timeline
### 1.3 Key Drivers

## 2. Emerging Technologies
### 2.1 Technology #1
- **Description**
- **Maturity Level**
- **Adoption Rate**
- **Use Cases**

### 2.2 Technology #2
[Same structure as above]

### 2.3 Technology #3
[Same structure as above]

## 3. Market Analysis
### 3.1 Market Size & Growth
### 3.2 Investment Trends
### 3.3 Key Players & Ecosystem

## 4. Impact Assessment
### 4.1 Industry Impact
### 4.2 Business Model Disruption
### 4.3 Regulatory Considerations

## 5. Future Outlook
### 5.1 Short-term (1-2 years)
### 5.2 Medium-term (3-5 years)
### 5.3 Long-term (5+ years)

## 6. Strategic Recommendations
### 6.1 Technology Adoption Strategy
### 6.2 Investment Priorities
### 6.3 Risk Mitigation`,
      category: 'Technology',
      icon: '🚀',
    },
    {
      id: 5,
      title: 'Financial Analysis Report',
      description: 'Financial performance and investment analysis',
      template: `# Financial Analysis Report

## Executive Summary
- Financial highlights
- Key metrics
- Investment recommendation

## 1. Company Overview
### 1.1 Business Model
### 1.2 Revenue Streams
### 1.3 Market Position

## 2. Financial Performance
### 2.1 Revenue Analysis
- Historical trends
- Growth rates
- Revenue breakdown

### 2.2 Profitability Analysis
- Gross margin
- Operating margin
- Net profit margin

### 2.3 Cash Flow Analysis
- Operating cash flow
- Investing activities
- Financing activities

## 3. Financial Ratios
### 3.1 Liquidity Ratios
- Current ratio
- Quick ratio

### 3.2 Profitability Ratios
- ROE, ROA, ROIC

### 3.3 Leverage Ratios
- Debt-to-equity
- Interest coverage

### 3.4 Efficiency Ratios
- Asset turnover
- Inventory turnover

## 4. Valuation Analysis
### 4.1 Valuation Methods
### 4.2 Fair Value Estimate
### 4.3 Price Targets

## 5. Risk Assessment
### 5.1 Business Risks
### 5.2 Financial Risks
### 5.3 Market Risks

## 6. Investment Recommendation
### 6.1 Rating (Buy/Hold/Sell)
### 6.2 Supporting Rationale
### 6.3 Investment Thesis`,
      category: 'Finance',
      icon: '💰',
    },
    {
      id: 6,
      title: 'Literature Review',
      description: 'Academic research synthesis document',
      template: `# Literature Review

## Abstract
- Research question
- Scope of review
- Key findings
- Conclusions

## 1. Introduction
### 1.1 Background
### 1.2 Research Objectives
### 1.3 Scope & Limitations
### 1.4 Methodology

## 2. Theoretical Framework
### 2.1 Core Concepts
### 2.2 Theoretical Models
### 2.3 Conceptual Framework

## 3. Literature Review by Theme
### 3.1 Theme/Topic 1
- **Key Studies**
- **Main Findings**
- **Critical Analysis**
- **Research Gaps**

### 3.2 Theme/Topic 2
[Same structure as above]

### 3.3 Theme/Topic 3
[Same structure as above]

## 4. Synthesis & Analysis
### 4.1 Common Themes
### 4.2 Contradictions & Debates
### 4.3 Methodological Approaches
### 4.4 Research Gaps

## 5. Discussion
### 5.1 Key Insights
### 5.2 Implications
### 5.3 Limitations

## 6. Conclusion
### 6.1 Summary of Findings
### 6.2 Future Research Directions
### 6.3 Practical Applications

## References
- [Citation format as per academic standards]`,
      category: 'Academic',
      icon: '📚',
    },
    {
      id: 5,
      title: 'AI Ethics Research Template',
      description: 'Framework for analyzing ethical implications of AI systems',
      template: `# AI Ethics Research Template

## Executive Summary
- AI system overview
- Key ethical concerns identified
- Recommendations for responsible AI development

## 1. AI System Description
### 1.1 Purpose & Functionality
### 1.2 Target Users & Use Cases
### 1.3 Technical Architecture Overview

## 2. Ethical Analysis Framework
### 2.1 Fairness & Bias Assessment
- Data bias evaluation
- Algorithmic fairness metrics
- Disparate impact analysis

### 2.2 Transparency & Explainability
- Model interpretability
- Decision explanation capabilities
- Audit trail requirements

### 2.3 Privacy & Data Protection
- Data collection practices
- User consent mechanisms
- Data minimization strategies

### 2.4 Accountability & Governance
- Responsibility assignment
- Oversight mechanisms
- Incident response protocols

## 3. Risk Assessment
### 3.1 Potential Harms
- Individual level impacts
- Societal implications
- Long-term consequences

### 3.2 Vulnerability Analysis
- Attack vectors
- Failure modes
- Edge cases

## 4. Mitigation Strategies
### 4.1 Technical Safeguards
- Bias detection algorithms
- Privacy-preserving techniques
- Robustness improvements

### 4.2 Policy & Governance
- Ethical guidelines implementation
- Regular audits and reviews
- Stakeholder engagement

## 5. Recommendations
### 5.1 Immediate Actions
### 5.2 Long-term Strategy
### 5.3 Monitoring & Evaluation

## Appendix
- Ethical review checklist
- Implementation timeline
- Resource requirements`,
      category: 'Technology',
      icon: '🤖',
    },
  ];

  const handleTemplateSelect = (template: ResearchTemplate) => {
    setPreviewTemplate(template);
  };

  const handleCopyTemplate = (template: ResearchTemplate) => {
    navigator.clipboard.writeText(template.template);
    setCopiedTemplateId(template.id);
    setTimeout(() => setCopiedTemplateId(null), 2000);
  };

  const recentResearch = [
    {
      id: 1,
      title: 'Market Trend Analysis Report',
      status: 'In Progress',
      progress: 75,
      date: '2025-11-01',
      badge: 'warning',
    },
    {
      id: 2,
      title: 'Competitive Analysis Report',
      status: 'Completed',
      progress: 100,
      date: '2025-10-28',
      badge: 'success',
    },
    {
      id: 3,
      title: 'User Behavior Research',
      status: 'Not Started',
      progress: 0,
      date: '2025-11-05',
      badge: 'secondary',
    },
  ];

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate search
    setTimeout(() => {
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Research Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Manage and track your research projects with AI-powered insights
        </p>
      </div>

      {/* AI Research Assistant */}
      <Card className="border-2 border-primary/20 shadow-xl">
        <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🤖</span>
            <div>
              <CardTitle className="text-2xl">AI Research Assistant</CardTitle>
              <CardDescription className="text-base">Use AI for in-depth research and data analysis</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="search" className="text-base font-semibold">Enter research topic or question</Label>
              <Input
                id="search"
                placeholder="For example: Analyze e-commerce market trends in 2024..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-2 h-12 text-base"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !searchQuery}
                size="lg"
                className="flex-1 shadow-md hover:shadow-lg transition-shadow"
              >
                {isSearching ? (
                  <>
                    <span className="animate-spin mr-2">⚙️</span>
                    Searching...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🚀</span>
                    Start Research
                  </>
                )}
              </Button>
              <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg">
                    <span className="mr-2">📋</span>
                    Templates
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col">
                  <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                      <span>📋</span>
                      Document Templates
                    </DialogTitle>
                    <DialogDescription>
                      Choose a document format template for your research output
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex gap-4 flex-1 overflow-hidden">
                    {/* Template List */}
                    <div className="w-1/3 overflow-y-auto space-y-3">
                      {researchTemplates.map((template) => (
                        <Card 
                          key={template.id}
                          className={`cursor-pointer transition-all ${
                            previewTemplate?.id === template.id 
                              ? 'border-primary shadow-md bg-primary/5' 
                              : 'hover:border-primary/50 hover:shadow-sm'
                          }`}
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <CardHeader className="p-4">
                            <CardTitle className="flex items-center gap-2 text-base">
                              <span className="text-xl">{template.icon}</span>
                              <span className="text-sm">{template.title}</span>
                            </CardTitle>
                            <Badge variant="secondary" className="w-fit text-xs">
                              {template.category}
                            </Badge>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <p className="text-xs text-muted-foreground">
                              {template.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Preview Panel */}
                    <div className="flex-1 flex flex-col overflow-hidden border rounded-lg">
                      {previewTemplate ? (
                        <>
                          <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold flex items-center gap-2">
                                <span>{previewTemplate.icon}</span>
                                {previewTemplate.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">{previewTemplate.description}</p>
                            </div>
                            <Button 
                              size="sm"
                              onClick={() => handleCopyTemplate(previewTemplate)}
                              className="gap-2"
                            >
                              {copiedTemplateId === previewTemplate.id ? (
                                <>
                                  <span>✅</span>
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <span>📋</span>
                                  Copy Template
                                </>
                              )}
                            </Button>
                          </div>
                          <div className="flex-1 overflow-y-auto p-4 bg-surface">
                            <DocumentPreview content={previewTemplate.template} />
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                          <div className="text-center space-y-2">
                            <div className="text-5xl">📋</div>
                            <p className="text-lg font-medium">Select a template to preview</p>
                            <p className="text-sm">Click on any template card to see its structure</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {isSearching && (
            <Alert className="mt-4 border-primary/50 bg-primary/5">
              <AlertTitle className="flex items-center gap-2">
                <span className="animate-pulse">🔍</span>
                AI is analyzing your request...
              </AlertTitle>
              <AlertDescription>
                This may take a few moments. We're gathering the best insights for you.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Recent Research with Tabs */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Research Projects</h2>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="inprogress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="space-y-4">
              {recentResearch.map((item) => (
                <Card 
                  key={item.id}
                  className="hover:shadow-lg transition-all duration-300 hover:border-primary/50"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          <Badge 
                            variant={item.badge as any}
                            className="shadow-sm"
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium">Progress: {item.progress}%</span>
                            <span>•</span>
                            <span>📅 {item.date}</span>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <span className="mr-1">👁️</span>
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          <span>⋮</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="inprogress" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center py-8">
                  Filter by in-progress projects
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center py-8">
                  Filter by completed projects
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center py-8">
                  Filter by pending projects
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Research;
