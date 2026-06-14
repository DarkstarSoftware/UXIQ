<div className="sidebar">
  <div className="sidebar-top">

    {/* Logo */}

    {/* Navigation */}

    <nav className="sidebar-nav">
      {/* Dashboard */}
      {/* Reports */}
      {/* Roadmaps */}
      {/* Competitors */}
      {/* Settings */}
    </nav>

  </div>

  <div className="sidebar-bottom">

    <div className="sidebar-user">
      <div className="profile-avatar">
        {user?.email?.charAt(0).toUpperCase()}
      </div>

      <div>
        <p className="sidebar-user-name">
          {profile?.full_name || 'Account'}
        </p>

        <span className="badge badge-pro">
          {profile?.plan === 'pro_lifetime'
            ? 'Pro Lifetime'
            : profile?.plan === 'pro'
            ? 'Pro'
            : 'Free'}
        </span>
      </div>
    </div>

    <form action="/auth/signout" method="POST">
      <Button
        type="submit"
        variant="ghost"
        className="w-full justify-start"
      >
        Log Out
      </Button>
    </form>

  </div>
</div>