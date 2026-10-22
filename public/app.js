// React and ReactDOM are loaded by the <script> tags in index.html.

/* ---------- Home: companies and the students who interviewed there ---------- */
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      experiences: [],
      search: ''
    };
  }

  // runs once, right after the component appears on the screen
  componentDidMount() {
    fetch('/api/experiences').then(res => res.json()).then(data => this.setState({
      experiences: data
    }));
  }
  render() {
    // keep only the experiences whose company name contains the search text
    const search = this.state.search.toLowerCase();
    const experiences = this.state.experiences.filter(exp => exp.company.toLowerCase().includes(search));

    // list of company names, without repeats
    const companies = [];
    experiences.forEach(exp => {
      if (!companies.includes(exp.company)) companies.push(exp.company);
    });
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Preparing for an interview? See who from our college has already attended it and what they were asked."), /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "Search by company",
      onChange: event => this.setState({
        search: event.target.value
      })
    }), companies.map(company => /*#__PURE__*/React.createElement("div", {
      key: company
    }, /*#__PURE__*/React.createElement("h3", null, company), /*#__PURE__*/React.createElement("ul", null, experiences.filter(exp => exp.company === company).map(exp => /*#__PURE__*/React.createElement("li", {
      key: exp._id
    }, exp.studentName, " - ", exp.role, /*#__PURE__*/React.createElement("button", {
      onClick: () => this.props.onOpen(exp)
    }, "View")))))));
  }
}

/* ---------- ExperienceDetail: one student's full write-up ---------- */
class ExperienceDetail extends React.Component {
  render() {
    const exp = this.props.experience;
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
      onClick: this.props.onBack
    }, "Back"), /*#__PURE__*/React.createElement("h2", null, exp.company, " - ", exp.role), /*#__PURE__*/React.createElement("p", null, exp.studentName, " (", exp.branch, ", ", exp.batch, ")"), /*#__PURE__*/React.createElement("p", null, "Date: ", exp.interviewDate ? exp.interviewDate.slice(0, 10) : 'not given', " | Difficulty: ", exp.difficulty, " | Result: ", exp.outcome), /*#__PURE__*/React.createElement("h3", null, "Rounds"), /*#__PURE__*/React.createElement("p", {
      className: "text"
    }, exp.rounds), /*#__PURE__*/React.createElement("h3", null, "Questions asked"), /*#__PURE__*/React.createElement("p", {
      className: "text"
    }, exp.questions), /*#__PURE__*/React.createElement("h3", null, "Tips"), /*#__PURE__*/React.createElement("p", {
      className: "text"
    }, exp.tips));
  }
}

/* ---------- ShareForm: the questions a student answers ---------- */
class ShareForm extends React.Component {
  constructor(props) {
    super(props);
    // one state value for every question in the form
    this.state = {
      studentName: '',
      branch: '',
      batch: '',
      company: '',
      role: '',
      interviewDate: '',
      difficulty: 'Easy',
      outcome: 'Selected',
      rounds: '',
      questions: '',
      tips: ''
    };
    // so that "this" works inside these methods
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // runs on every keystroke: stores the typed value in state, using the input's name
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  // send the state (all the answers) to the server, then go back home
  handleSubmit(event) {
    event.preventDefault();
    fetch('/api/experiences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    }).then(() => this.props.onDone());
  }
  render() {
    return /*#__PURE__*/React.createElement("form", {
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/React.createElement("h2", null, "Share your interview experience"), /*#__PURE__*/React.createElement("label", null, "Your name"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "studentName",
      onChange: this.handleChange,
      required: true
    }), /*#__PURE__*/React.createElement("label", null, "Branch"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "branch",
      onChange: this.handleChange,
      required: true
    }), /*#__PURE__*/React.createElement("label", null, "Graduation year"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "batch",
      onChange: this.handleChange,
      required: true
    }), /*#__PURE__*/React.createElement("label", null, "Company"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "company",
      onChange: this.handleChange,
      required: true
    }), /*#__PURE__*/React.createElement("label", null, "Role you applied for"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "role",
      onChange: this.handleChange,
      required: true
    }), /*#__PURE__*/React.createElement("label", null, "Interview date"), /*#__PURE__*/React.createElement("input", {
      type: "date",
      name: "interviewDate",
      onChange: this.handleChange,
      required: true
    }), /*#__PURE__*/React.createElement("label", null, "How difficult was it?"), /*#__PURE__*/React.createElement("select", {
      name: "difficulty",
      onChange: this.handleChange
    }, /*#__PURE__*/React.createElement("option", null, "Easy"), /*#__PURE__*/React.createElement("option", null, "Medium"), /*#__PURE__*/React.createElement("option", null, "Hard")), /*#__PURE__*/React.createElement("label", null, "Result"), /*#__PURE__*/React.createElement("select", {
      name: "outcome",
      onChange: this.handleChange
    }, /*#__PURE__*/React.createElement("option", null, "Selected"), /*#__PURE__*/React.createElement("option", null, "Not selected"), /*#__PURE__*/React.createElement("option", null, "Result awaited")), /*#__PURE__*/React.createElement("label", null, "What were the rounds?"), /*#__PURE__*/React.createElement("textarea", {
      name: "rounds",
      rows: "4",
      onChange: this.handleChange,
      required: true
    }), /*#__PURE__*/React.createElement("label", null, "What questions were asked?"), /*#__PURE__*/React.createElement("textarea", {
      name: "questions",
      rows: "4",
      onChange: this.handleChange,
      required: true
    }), /*#__PURE__*/React.createElement("label", null, "Any tips for others?"), /*#__PURE__*/React.createElement("textarea", {
      name: "tips",
      rows: "4",
      onChange: this.handleChange
    }), /*#__PURE__*/React.createElement("button", {
      type: "submit"
    }, "Publish"));
  }
}

/* ---------- App: decides which page to show ---------- */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'home',
      selected: null
    };
  }
  render() {
    const page = this.state.page;
    return /*#__PURE__*/React.createElement("div", {
      className: "container"
    }, /*#__PURE__*/React.createElement("h1", null, "Interview Experiences"), /*#__PURE__*/React.createElement("button", {
      onClick: () => this.setState({
        page: 'home'
      })
    }, "Home"), /*#__PURE__*/React.createElement("button", {
      onClick: () => this.setState({
        page: 'form'
      })
    }, "Share your experience"), /*#__PURE__*/React.createElement("hr", null), page === 'home' && /*#__PURE__*/React.createElement(Home, {
      onOpen: exp => this.setState({
        page: 'detail',
        selected: exp
      })
    }), page === 'form' && /*#__PURE__*/React.createElement(ShareForm, {
      onDone: () => this.setState({
        page: 'home'
      })
    }), page === 'detail' && /*#__PURE__*/React.createElement(ExperienceDetail, {
      experience: this.state.selected,
      onBack: () => this.setState({
        page: 'home'
      })
    }));
  }
}
ReactDOM.render(/*#__PURE__*/React.createElement(App, null), document.getElementById('root'));